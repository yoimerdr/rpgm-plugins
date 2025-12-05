import {MaybeNumber} from "@jstls/types/core";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass} from "@languages-plugin/shortcuts/cls";
import {getIf, isDefined, isNumber, returns} from "@languages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {parameters} from "@languages-plugin/parameters";
import {descriptor2, readonly, readonlys2} from "@languages-plugin/shortcuts/properties";
import {JsonSerializable} from "@languages-plugin/lib";
import {setTo} from "@languages-plugin/shortcuts/mappers";

export interface TextCommand extends JsonSerializable {
  readonly eventId: number;
  readonly pageIndex: number;
  readonly index: number;
  readonly parameters: string[];
  readonly length?: MaybeNumber;

  join(): TextCommand;

  split(): TextCommand;

  readonly isValid: boolean;
}

export interface TextCommandConstructor extends WithPrototype<TextCommand> {
  new(eventId?: number,
      pageIndex?: number,
      index?: number,
      parameters?: string[]): TextCommand
}


export const TextCommand: TextCommandConstructor = funclass({
  construct: function (eventId, pageIndex, index, parameters) {
    const $this = this;
    readonlys2($this, {
      eventId: getIf(eventId, isNumber, returns(-1)),
      pageIndex: getIf(pageIndex, isNumber, returns(-1)),
      index: getIf(index, isNumber, returns(-1)),
      parameters: getIf(parameters, isArray, returns([])),
    });
  },
  prototype: {
    join: function () {
      const $this = this,
        {eventId, parameters: params, pageIndex, index} = $this;

      if (params.length <= 1)
        return new TextCommand(
          eventId,
          pageIndex,
          index,
          params,
        )

      const source = new TextCommand(
        eventId,
        pageIndex,
        index,
        [params.join(parameters.joinSeparator)]
      );

      readonly(source, "length", params.length);
      return source;
    },
    split: function (): TextCommand {
      const $this = this,
        {eventId, parameters: params, pageIndex, index, length} = $this;

      let source: string[] = params;
      if (isDefined(length) && length! >= 1)
        source = params.first().split(parameters.joinSeparator);

      return new TextCommand(
        eventId,
        pageIndex,
        index,
        source
      )
    },
    toJSON() {
      const $this = this;
      return setTo($this, ["eventId", "parameters", "pageIndex", "index", "length"], {})
    }
  },
  protodescriptor: {
    isValid: descriptor2<TextCommand, "isValid">(function () {
      const $this = this;
      return [$this.pageIndex, $this.eventId, $this.index].every(value => value >= 0);
    })
  }
})
