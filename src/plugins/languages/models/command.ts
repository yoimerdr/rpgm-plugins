import {MaybeNumber} from "@jstls/types/core";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass} from "@languages-plugin/shortcuts/cls";
import {getIf, isDefined, isNumber, isString, returns} from "@languages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {parameters} from "@languages-plugin/parameters";
import {descriptor2, readonly, readonlys2} from "@languages-plugin/shortcuts/properties";
import {JsonSerializable} from "@languages-plugin/lib";
import {setTo} from "@languages-plugin/shortcuts/mappers";

/**
 * Represents a text command extracted from an event in the game.
 * Used for storing and manipulating localized event text commands.
 */
export interface TextCommand extends JsonSerializable {
  /** The ID of the event containing this text command */
  readonly eventId: number;

  /** The index of the event page containing this text command */
  readonly pageIndex: number;

  /** The index of this command within the event's command list */
  readonly index: number;

  /** The text parameters of this command (typically the text to display) */
  readonly parameters: string[];

  /**
   * The number of original text commands that were joined together.
   * Only set when multiple Show Text commands were merged during extraction.
   */
  readonly length?: MaybeNumber;

  /**
   * Joins multiple text command parameters into a single parameter.
   * Used when saving translations to combine split text lines.
   * @returns A new TextCommand with parameters joined using the joinSeparator
   */
  join(): TextCommand;

  /**
   * Splits a joined text command back into individual commands.
   * Used when loading translations to restore original command structure.
   * @returns A new TextCommand with parameters split by the joinSeparator
   */
  split(): TextCommand;

  /** Whether this command has valid indices (eventId, pageIndex, index >= 0) */
  readonly isValid: boolean;
}

/**
 * Constructor interface for creating TextCommand instances.
 */
export interface TextCommandConstructor extends WithPrototype<TextCommand> {
  /**
   * Creates a new TextCommand with the specified parameters.
   * @param eventId - The event ID
   * @param pageIndex - The page index
   * @param index - The command index
   * @param parameters - The text parameters
   */
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
      if (isDefined(length) && length! >= 1 && params && params.length > 0) {
        const firstParam = params.firstOrNull();
        source = isString(firstParam) ? firstParam!.split(parameters.joinSeparator) : [];
      }

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
