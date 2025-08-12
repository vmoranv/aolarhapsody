import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enAstralSpirit from './locales/en/astralSpirit.json';
import enAttribute from './locales/en/attribute.json';
import enCharacterAnalyzer from './locales/en/characterAnalyzer.json';
import enCommon from './locales/en/common.json';
import enCrystalKey from './locales/en/crystalKey.json';
import enExistingPackets from './locales/en/existingPackets.json';
import enGodCard from './locales/en/godCard.json';
import enHk from './locales/en/hk.json';
import enHome from './locales/en/home.json';
import enImageCompressor from './locales/en/imageCompressor.json';
import enInscription from './locales/en/inscription.json';
import enLanding from './locales/en/landing.json';
import enMiscellaneous from './locales/en/miscellaneous.json';
import enPetCard from './locales/en/petCard.json';
import enPetCard2 from './locales/en/petCard2.json';
import enPetDictionary from './locales/en/petDictionary.json';
import enPmDataList from './locales/en/pmDataList.json';
import enPoster from './locales/en/poster.json';
import enTote from './locales/en/tote.json';
import zhAstralSpirit from './locales/zh/astralSpirit.json';
import zhAttribute from './locales/zh/attribute.json';
import zhCharacterAnalyzer from './locales/zh/characterAnalyzer.json';
import zhCommon from './locales/zh/common.json';
import zhCrystalKey from './locales/zh/crystalKey.json';
import zhExistingPackets from './locales/zh/existingPackets.json';
import zhGodCard from './locales/zh/godCard.json';
import zhHk from './locales/zh/hk.json';
import zhHome from './locales/zh/home.json';
import zhImageCompressor from './locales/zh/imageCompressor.json';
import zhInscription from './locales/zh/inscription.json';
import zhLanding from './locales/zh/landing.json';
import zhMiscellaneous from './locales/zh/miscellaneous.json';
import zhPetCard from './locales/zh/petCard.json';
import zhPetCard2 from './locales/zh/petCard2.json';
import zhPetDictionary from './locales/zh/petDictionary.json';
import zhPmDataList from './locales/zh/pmDataList.json';
import zhPoster from './locales/zh/poster.json';
import zhTote from './locales/zh/tote.json';
import { useSettingStore } from './store/setting';

const kimiPostProcessor = {
  type: 'postProcessor' as const,
  name: 'kimi',
  process: (value: string, key: string[], options: any, translator: any) => {
    const kimiMode = useSettingStore.getState().kimiMode;
    if (kimiMode) {
      const descriptions = translator.resourceStore.data[translator.language].common
        .kimiModeDescription as string[];
      const randomIndex = Math.floor(Math.random() * descriptions.length);
      return descriptions[randomIndex];
    }
    return value;
  },
};

i18n
  .use(kimiPostProcessor)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: 'zh',
    fallbackLng: 'zh',
    ns: [
      'common',
      'landing',
      'home',
      'astralSpirit',
      'attribute',
      'characterAnalyzer',
      'crystalKey',
      'existingPackets',
      'godCard',
      'hk',
      'imageCompressor',
      'inscription',
      'miscellaneous',
      'petCard',
      'petCard2',
      'petDictionary',
      'pmDataList',
      'poster',
      'tote',
    ],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    postProcess: ['kimi'],
    resources: {
      en: {
        common: enCommon,
        landing: enLanding,
        home: enHome,
        astralSpirit: enAstralSpirit,
        attribute: enAttribute,
        characterAnalyzer: enCharacterAnalyzer,
        crystalKey: enCrystalKey,
        existingPackets: enExistingPackets,
        godCard: enGodCard,
        hk: enHk,
        imageCompressor: enImageCompressor,
        inscription: enInscription,
        miscellaneous: enMiscellaneous,
        petCard: enPetCard,
        petCard2: enPetCard2,
        petDictionary: enPetDictionary,
        pmDataList: enPmDataList,
        poster: enPoster,
        tote: enTote,
      },
      zh: {
        common: zhCommon,
        landing: zhLanding,
        home: zhHome,
        astralSpirit: zhAstralSpirit,
        attribute: zhAttribute,
        characterAnalyzer: zhCharacterAnalyzer,
        crystalKey: zhCrystalKey,
        existingPackets: zhExistingPackets,
        godCard: zhGodCard,
        hk: zhHk,
        imageCompressor: zhImageCompressor,
        inscription: zhInscription,
        miscellaneous: zhMiscellaneous,
        petCard: zhPetCard,
        petCard2: zhPetCard2,
        petDictionary: zhPetDictionary,
        pmDataList: zhPmDataList,
        poster: zhPoster,
        tote: zhTote,
      },
    },
  });

export default i18n;
