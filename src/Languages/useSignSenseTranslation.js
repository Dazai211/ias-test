// useSignSenseTranslation.js
// Custom hook for SignSense game translations.
// Looks up Filipino translation in signSenseTranslations; falls back to English key if not found.

import { useLanguage } from './i18n2lang.jsx';
import { signSenseTranslations } from './SignSenseTranslation';

export function useSignSenseTranslation() {
  const { language } = useLanguage();

  function t(key) {
    // Fallback is always the value from the quiz data (English)
    if (language !== 'fil') {
      return key.split('.').pop(); // Use the last part of the key as the fallback (matches quiz data)
    }
    // For Filipino, look up translation, fallback to quiz data value
    const keys = key.split('.');
    let value = signSenseTranslations.fil;
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
// This hook provides t(key) for SignSense translations, with fallback logic to the quiz data value (English). 