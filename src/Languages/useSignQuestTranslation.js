// useSignQuestTranslation.js
// Custom hook for SignQuest game translations.
// Looks up Filipino translation in signQuestTranslations; falls back to English key if not found.

import { useLanguage } from './i18n2lang.jsx';
import { signQuestTranslations } from './SignQuestTranslation';

export function useSignQuestTranslation() {
  const { language } = useLanguage();

  function t(key) {
    // Fallback is always the value from the quiz data (English)
    if (language !== 'fil') {
      return key.split('.').pop(); // Use the last part of the key as the fallback (matches quiz data)
    }
    // For Filipino, look up translation, fallback to quiz data value
    const keys = key.split('.');
    let value = signQuestTranslations.fil;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return keys[keys.length - 1];
      }
    }
    return value === undefined || value === null ? keys[keys.length - 1] : value;
  }

  return { t };
}
// This hook provides t(key) for SignQuest translations, with fallback logic to the quiz data value (English). 