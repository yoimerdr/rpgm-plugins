///=============================================================================
/// YDP_CrossAssets | 1.0.1 | <%= moment().format('MMMM Do YYYY') %>
///=============================================================================
/*:
 * @plugindesc
 * A plugin for standardizing asset paths to ensure cross-platform compatibility.
 *
 * @author Davila Yoimer
 *
 * @param filename
 * @text Source Filename
 * @type string
 * @desc The name of the JSON file containing the asset paths (without extension).
 * @default assets
 *
 * @param folder
 * @text Source Directory
 * @type string
 * @desc The folder where the source JSON file is stored.
 * @default data/crossassets
 *
 * @param imageFolders
 * @text Image Folders
 * @type string[]
 * @desc The list of folders inside 'img/' to scan for images.
 * @parent allImageFolders
 * @default []
 *
 * @param allImageFolders
 * @text Scan All Image Folders
 * @type boolean
 * @on Yes
 * @off No
 * @desc If enabled, scans every folder inside 'img/' and ignores Image Folders.
 * @default true
 *
 * @param audioFolders
 * @text Audio Folders
 * @type string[]
 * @desc The list of folders inside 'audio/' to scan for audios.
 * @parent allAudioFolders
 * @default []
 *
 * @param allAudioFolders
 * @text Scan All Audio Folders
 * @type boolean
 * @on Yes
 * @off No
 * @desc If enabled, scans every folder inside 'audio/' and ignores Audio Folders.
 * @default true
 *
 * @param generationMode
 * @text File Generation Mode
 * @desc (PC Only) Controls how the image source file is generated.
 * @type combo
 * @option always
 * @option auto
 * @option none
 * @desc always: Generate on every run. auto: Generate if missing. none: The file is not generated.
 * @default auto
 *
 * @param loadMode
 * @text Loading Strategy
 * @desc How asset paths are loaded into memory.
 * @type combo
 * @option flatten
 * @option raw
 * @desc flatten: Flattens the object structure. raw: Keeps the nested structure.
 * @default flatten
 *
 * @help
 * =============================================================================
 * YDP_CrossAssets
 * =============================================================================
 * This plugin addresses case-sensitivity issues when deploying to mobile platforms.
 * Diverse OSs (like Android/iOS/Linux) require exact filename matching, unlike
 * Windows which is case-insensitive.
 *
 * This plugin scans your project's images and audios, and maps them, ensuring that
 * requests for images always resolve to the correct, case-sensitive filename,
 * and allows you to continue using case-insensitive filenames in your code
 * (whether by choice or oversight).
 *
 * =============================================================================
 * Setup
 * =============================================================================
 * 1. Configure the "Assets Folders" you want to scan.
 * 2. Set the "File Generation Mode" to "auto" (or "always" for the first run).
 * 3. Run the game in a desktop environment to generate the JSON source file.
 *
 * =============================================================================
 */

if("undefined"==typeof YDP_Core){var o="The YDP_Core plugin is necessary. See the docs on https://www.github.com/yoimerdr/rpgm-plugins";throw Scene_Boot.prototype.start=function(){throw new Error(o)},new Error(o)}
