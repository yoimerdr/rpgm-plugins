import {CustomTextTrimmers, parameters} from '@languages-plugin/parameters';

export function resetLanguageTestParameters() {
  parameters.loadMode = 'full';
  parameters.enableImages = true;
  parameters.enableCustom = true;
  parameters.customFallbacks = false;
  parameters.enableEscapeTag = false;
  parameters.escapeTagKey = 'L';
  parameters.enableWrappingTag = false;
  parameters.wrappingTagKey = 'L';
  parameters.wrappingTagFormat = 'curly';
  parameters.customTrimmers = {} as CustomTextTrimmers;
}
