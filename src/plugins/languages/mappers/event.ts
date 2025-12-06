import {TextCommandEvent, EventTextCommand, LanguageTextCommand} from "@languages-plugin/models/source";
import {getIf, isDefined, isNumber, isObject, returns} from "@languages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {TextCommand} from "@languages-plugin/models/command";
import {each, keach} from "@languages-plugin/shortcuts/iterables";
import {get, string} from "@languages-plugin/shortcuts/mappers";
import {parameters} from "@languages-plugin/parameters";
import {readonly} from "@languages-plugin/shortcuts/properties";
import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {fromSourceTransform, toSourceTransform} from "@languages-plugin/mappers/base";
import {Maybe} from "@jstls/types/core";


export const commandDescriptor: Readonly<SetTransformDescriptor<TextCommandEvent>> = {
  parameters: "p",
  length: "l"
}

export const commandToTransform = toSourceTransform<TextCommandEvent>(commandDescriptor),
  commandFromTransform = fromSourceTransform<TextCommandEvent>(commandDescriptor);

export function assignCommandToEvent(commands: EventTextCommand, events: (MapEvent | DataTroop)[]) {
  if (!isObject(commands) || !isArray(events))
    return;

  function getEventItem(command: TextCommand, index?: number): Maybe<EventItem> {
    index = getIf(index, isNumber, returns(0));
    const source = get(
      events, command.eventId, "pages",
      command.pageIndex, "list", command.index + index
    ) as Maybe<EventItem>;

    if (!source || !source.code.isTextCode())
      return undefined;

    return source;
  }

  function assignJoinedParameters(command: TextCommand) {
    let reducerIndex = 0,
      source = command.split();

    each(source.parameters, function (parameter, index) {
      if (parameter.isEmpty()) {
        reducerIndex++;
        return;
      }

      index -= reducerIndex;

      if (index.isFromUntil(0, command.length!)) {
        const item = getEventItem(command, index);
        item && (item.parameters[0] = parameter);
      }
    })
  }

  keach(commands, function (command, eventId) {
    if (!isDefined(command))
      return;

    keach(command, function (page, pageIndex) {
      if (!isDefined(page))
        return;

      keach(page, function (source, index) {
        if (!isDefined(source))
          return;

        const evt = commandFromTransform(source),
          cmd = new TextCommand(
            string(eventId).toInt()!,
            string(pageIndex).toInt()!,
            string(index).toInt()!,
            evt.parameters
          );

        if (!cmd.isValid)
          return;

        readonly(cmd, "length", evt.length);
        if (cmd.length && cmd.length > 1) {
          assignJoinedParameters(cmd)
        } else {
          const evt = getEventItem(cmd);
          evt && (evt.parameters = cmd.parameters);
        }
      });
    });
  });
}

export function eventToCommand(event: MapEvent | DataTroop): LanguageTextCommand {
  if (!isObject(event) || !isArray(event.pages))
    return {};

  let command = new TextCommand();
  const commands: LanguageTextCommand = {};

  function appendCommand(page: number, index: number) {
    if (!command.isValid || command.parameters.isEmpty())
      return;

    commands[page][index] = commandToTransform(command.join());
    command = new TextCommand();
  }

  each(
    event.pages,
    function (page, pageIndex) {
      if (!isObject(page) || page.list.isEmpty())
        return;

      !commands[pageIndex] && (commands[pageIndex] = {});


      each(
        page.list,
        function (source, index) {
          if (!isObject(source))
            return;

          const {code, parameters: params} = source;
          if (code.isTextCode()) {
            // check if is command code is for show text and validate plugins parameter for join them
            if (code.isShowTextCode() && parameters.joinShowText) {
              // if it is the first show text command, instance a new object
              if (command.parameters.isEmpty()) {
                command = new TextCommand(
                  event.id,
                  pageIndex,
                  index,
                  command.parameters
                )
              }

              // put the first parameter of current command params
              const first = string(params.first());
              first.isNotEmpty() && command.parameters.push(first);
            } else {
              // if command code is not for show text, check if join show texts is active for push current
              parameters.joinShowText && appendCommand(command.pageIndex, command.index);
              // push current command with code for text
              if (params.isNotEmpty())
                commands[pageIndex][index] = commandToTransform(
                  new TextCommand(
                    event.id,
                    pageIndex,
                    index,
                    params as string[]
                  )
                )

            }
          } else appendCommand(command.pageIndex, command.index) // if command code is not for text, try to append
        }
      )
    }
  )

  return commands;
}
