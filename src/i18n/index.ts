import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';

// Simplified: only English and Traditional Chinese
// zh-CN will map to zh-TW
const resources = {
  en: { translation: en },
  'zh-TW': { translation: zhTW },
  'zh-CN': { translation: zhTW }, // Map to Traditional Chinese
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-TW',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Helper function to get bilingual text
export const tZhEn = (zh: string, en: string): string => {
  const currentLang = i18n.language;
  if (currentLang === 'en') {
    return `${en} / ${zh}`;
  }
  return `${zh} / ${en}`;
};

// Helper function to get text based on language
export const getLangText = (zh: string, en: string): string => {
  return i18n.language === 'en' ? en : zh;
};

export default i18n;