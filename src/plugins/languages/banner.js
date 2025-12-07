///=============================================================================
/// YDP_Languages | 1.0.0 | <%= moment().format('MMMM Do YYYY') %>
///=============================================================================
/*~struct~LanguageOption:
* @param code
* @text Language code
* @type string
* @desc The language key value.
* @param name
* @text Language name
* @type string
* @desc The language display name.
* @param label
* @text Language label
* @type string
* @desc The text shown in the options menu.
* @default Language
*/
/*:
 * @plugindesc
 * A plugin for game localization. Allows text translation via JSON files, automatic text extraction, and dynamic image switching.
 *
 * @author Davila Yoimer
 *
 * @param languages
 * @text Supported Languages
 * @type struct<LanguageOption>[]
 * @desc Define the list of languages available in the game.
 * @default ["{\"code\":\"default\",\"name\":\"English\",\"label\":\"Language\"}"]
 *
 * @param generationMode
 * @text File Generation Mode
 * @desc (PC Only) Controls how language JSON files are generated.
 * @type combo
 * @option always
 * @option auto
 * @option none
 * @desc always: Generate on every run. auto: Generate if missing. none: The files are not generated.
 * @default auto
 * @parent languages
 *
 * @param loadMode
 * @text Loading Strategy
 * @desc How language data is loaded into memory.
 * @type combo
 * @option full
 * @option lang
 * @desc full: Load all languages. lang: Load only the active language (saves memory).
 * @default lang
 * @parent languages
 *
 * @param folder
 * @text Language Directory
 * @type string
 * @desc The folder path where language JSON files are stored.
 * @parent languages
 * @default data/languages
 *
 * @param joinShowText
 * @text Join Show Text
 * @type boolean
 * @desc Automatically merge consecutive 'Show Text' commands into one translation entry.
 * @default true
 *
 * @param joinSeparatorType
 * @text Separator Type
 * @type combo
 * @option strict
 * @option unescaped
 * @desc strict: Use exact separator. unescaped: Process escape characters (e.g., \n).
 * @default unescaped
 * @parent joinShowText
 *
 * @param joinSeparator
 * @text Separator Character
 * @type string
 * @desc The character(s) used to join merged text lines.
 * @default \n\r
 * @parent joinShowText
 *
 * @param enableImages
 * @text Enable Image Localization
 * @type boolean
 * @desc Allow using different images based on the selected language.
 * @default true
 *
 * @param imageMode
 * @text Image Definition Mode
 * @type combo
 * @option all
 * @option lang
 * @desc all: Map all game images to the language file. lang: Only map images with a language suffix (e.g. img_es.png).
 * @default lang
 * @parent enableImages
 *
 * @param enableCustom
 * @text Enable Custom Texts
 * @type boolean
 * @desc Enable translations for texts that cannot be extracted automatically (e.g. dynamic show texts).
 * @default true
 *
 * @help
 * =============================================================================
 * __   ______  ____    _
 * \ \ / /  _ \|  _ \  | |    __ _ _ __   __ _ _   _  __ _  __ _  ___  ___
 *  \ V /| | | | |_) | | |   / _` | '_ \ / _` | | | |/ _` |/ _` |/ _ \/ __|
 *   | | | |_| |  __/  | |__| (_| | | | | (_| | |_| | (_| | (_| |  __/\__ \
 *   |_| |____/|_|     |_____\__,_|_| |_|\__, |\__,_|\__,_|\__, |\___||___/
 *                                       |___/             |___/
 * =============================================================================
 *
 * YDP_Languages
 * =============================================================================
 * This plugin provides a way to localize your RPG Maker project. It allows you to
 * easily translate text and switch images based on language.
 *
 * =============================================================================
 * Main Features
 * =============================================================================
 * - JSON-based translation files.
 * - Automatic extraction of text (NWJS).
 * - Support for joining multiple "Show Text" event commands.
 * - Localized images support.
 * - Memory efficient loading strategies.
 *
 * =============================================================================
 * Setup
 * =============================================================================
 * 1. Define your languages in the "Supported Languages" parameter.
 * 2. Choose a "Language Directory" (default is data/languages).
 * 3. Run the game (NWJS) with File Generation Mode set to "auto" or "always" to
 *    generate the initial JSON files. It assumes that the game is already
 *    finished.
 * 4. Edit the generated JSON files with your translations.
 *
 * =============================================================================
 * Joined Show Texts
 * =============================================================================
 * In the commonEvents or map### object inside the language file, there may be
 * objects with a key "l". This is produced because command objects with code 401
 * have been joined (first parameter of each). The "l" indicates how many
 * objects have been joined. This is done to reduce the size of the generated file.
 *
 * The string character used to join the texts is defined in the "Separator Character" parameter.
 * (e.g. in the default, \n\r is used).
 *
 * Example:
 *
 * Original Event Commands:
 * {
 *   "code": 401,
 *   "indent": 1,
 *   "parameters": [
 *     "I've got the perfect idea! I just need to liven things up"
 *   ]
 * },
 * {
 *   "code": 401,
 *   "indent": 1,
 *   "parameters": [
 *     "to boost the team's morale."
 *   ]
 * }
 *
 * If "Join Show Texts" is true:
 * {
 *  "p": [
 *      "I've got the perfect idea! I just need to liven things up \n\rto boost the team's morale."
 *    ],
 *  "l": 2
 * }
 *
 * If "Join Show Texts" is false:
 * {
 *   "p": [
 *     "I've got the perfect idea! I just need to liven things up"
 *   ]
 * },
 * {
 *   "p": [
 *     "to boost the team's morale."
 *   ]
 * }
 *
 * =============================================================================
 * Image Localization
 * =============================================================================
 * Enable "Enable Image Localization" to use different images for each language.
 * You can configure how these are defined using the "Image Definition Mode".
 *
 * =============================================================================
 * Custom Texts
 * =============================================================================
 * You can manually add a "custom" key to your language JSON file to translate
 * texts that cannot be automatically extracted (e.g. dynamic texts).
 *
 * Supported keys:
 * - option: Translations related to game options/commands.
 * - status: Translations for status values (e.g., ON/OFF).
 * - text: General purpose translations.
 *
 * Example:
 *
 * "custom": {
 *   "option": {
 *     "Load": "Load",
 *     "Save": "Save",
 *     "Delete": "Delete"
 *   },
 *   "status": {
 *     "ON": "ON",
 *     "OFF": "OFF"
 *   },
 *   "text": {
 *     "Please select a file slot.": "Please select a file slot.",
 *     "Loads the data from the saved game.": "Loads the data from the saved game."
 *   }
 * }
 *
 * =============================================================================
 */

if("undefined"==typeof YDP_Core){var o="The YDP_Core plugin is necessary. See the docs on https://www.github.com/yoimerdr/rpgm-plugins";throw Scene_Boot.prototype.start=function(){throw new Error(o)},new Error(o)}
