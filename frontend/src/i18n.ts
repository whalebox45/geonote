import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ja from './locales/ja.json';

const savedLocale = localStorage.getItem('locale') || 'en';


const i18n = createI18n({
  legacy: false, // Composition API 模式
  locale: savedLocale,  // 預設語言
  fallbackLocale: 'en',
  messages: {
    en,
    ja
  }
});

export default i18n;
