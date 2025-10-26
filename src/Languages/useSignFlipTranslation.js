// useSignFlipTranslation.js
// Custom hook for SignFlip game translations.
// Looks up Filipino translation in signFlipTranslations; falls back to English subtitle if not found.

import { useLanguage } from './i18n2lang.jsx';
import { signFlipTranslations } from './SignFlipTranslation';

export function useSignFlipTranslation() {
  const { language } = useLanguage();

  function t(key) {
    // Fallback is always the value from the pairs data (English subtitle)
    if (language !== 'fil') {
      return key;
    }
    // For Filipino, look up translation, fallback to subtitle value
    const value = signFlipTranslations.fil[key];
    return value === undefined || value === null ? key : value;
  }

  return { t };
} 