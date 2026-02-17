///=============================================================================
/// YDP_CrossImages | 1.0.1 | <%= moment().format('MMMM Do YYYY') %>
///=============================================================================
/*:
 * @plugindesc
 * Lightweight version of YDP_CrossImages for path standardization.
 *
 * @author Davila Yoimer
 *
 * @param filename
 * @text Source Filename
 * @type string
 * @desc The name of the JSON file containing the image paths (without extension).
 * @default images
 *
 * @param folder
 * @text Source Directory
 * @type string
 * @desc The folder where the source JSON file is stored.
 * @default data/crossimages
 *
 * @param loadMode
 * @text Loading Strategy
 * @desc How image paths are loaded into memory.
 * @type combo
 * @option flatten
 * @option raw
 * @desc flatten: Flattens the object structure. raw: Keeps the nested structure.
 * @default flatten
 *
 * @help
 * =============================================================================
 * YDP_CrossImages (Light)
 * =============================================================================
 * Lightweight version that only reads the generated image source file.
 * Ensures cross-platform compatibility by resolving case-sensitive paths,
 * allowing you to use non-case-sensitive filenames in your code.
 *
 * =============================================================================
 */

if("undefined"==typeof YDP_Core){var o="The YDP_Core plugin is necessary. See the docs on https://www.github.com/yoimerdr/rpgm-plugins";throw Scene_Boot.prototype.start=function(){throw new Error(o)},new Error(o)}
