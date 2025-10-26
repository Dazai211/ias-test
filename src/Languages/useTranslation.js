import { useLanguage } from './i18n2lang.jsx';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useLanguage();

  function t(key) {
    // Support nested keys like 'lessons.fundamentals.title'
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return undefined; // fallback to undefined if not found
      }
    }
    return value === undefined || value === null ? undefined : value;
  }

  return { t };
} 