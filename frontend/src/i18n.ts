import { initReactI18next } from 'react-i18next'; // React绑定插件
import i18n from 'i18next'; // i18next核心
import LanguageDetector from 'i18next-browser-languagedetector'; // 浏览器语言检测插件
import enAstralSpirit from './locales/en/astralSpirit.json';
import enAttribute from './locales/en/attribute.json';
import enBadwordCheck from './locales/en/badwordCheck.json';
import enCharacterAnalyzer from './locales/en/characterAnalyzer.json';
import enCommon from './locales/en/common.json'; // 通用翻译
import enCrystalKey from './locales/en/crystalKey.json';
import enDamageCalculator from './locales/en/damageCalculator.json';
import enExistingPackets from './locales/en/existingPackets.json';
import enExpCalculator from './locales/en/expCalculator.json';
import enGodCard from './locales/en/godCard.json';
import enHk from './locales/en/hk.json';
import enHome from './locales/en/home.json';
import enImageCompressor from './locales/en/imageCompressor.json';
import enInscription from './locales/en/inscription.json';
import enLanding from './locales/en/landing.json';
import enMiscellaneous from './locales/en/miscellaneous.json';
import enMultiPointBurst from './locales/en/multiPointBurst.json';
import enPetCard from './locales/en/petCard.json';
import enPetCard2 from './locales/en/petCard2.json';
import enPetDictionary from './locales/en/petDictionary.json';
import enPetExchange from './locales/en/petexchange.json';
import enPmDataList from './locales/en/pmDataList.json';
import enPoster from './locales/en/poster.json';
import enTote from './locales/en/tote.json';
import zhAstralSpirit from './locales/zh/astralSpirit.json';
import zhAttribute from './locales/zh/attribute.json';
import zhBadwordCheck from './locales/zh/badwordCheck.json';
import zhCharacterAnalyzer from './locales/zh/characterAnalyzer.json';
import zhCommon from './locales/zh/common.json'; // 通用翻译
import zhCrystalKey from './locales/zh/crystalKey.json';
import zhDamageCalculator from './locales/zh/damageCalculator.json';
import zhExistingPackets from './locales/zh/existingPackets.json';
import zhExpCalculator from './locales/zh/expCalculator.json';
import zhGodCard from './locales/zh/godCard.json';
import zhHk from './locales/zh/hk.json';
import zhHome from './locales/zh/home.json';
import zhImageCompressor from './locales/zh/imageCompressor.json';
import zhInscription from './locales/zh/inscription.json';
import zhLanding from './locales/zh/landing.json';
import zhMiscellaneous from './locales/zh/miscellaneous.json';
import zhMultiPointBurst from './locales/zh/multiPointBurst.json';
import zhPetCard from './locales/zh/petCard.json';
import zhPetCard2 from './locales/zh/petCard2.json';
import zhPetDictionary from './locales/zh/petDictionary.json';
import zhPetExchange from './locales/zh/petexchange.json';
import zhPmDataList from './locales/zh/pmDataList.json';
import zhPoster from './locales/zh/poster.json';
import zhTote from './locales/zh/tote.json';
import { useSettingStore } from './store/setting';

/**
 * @description 自定义i18next后处理器(PostProcessor) - Kimi模式
 * @description 当应用开启Kimi模式时，此处理器会拦截翻译结果，
 *              并从通用的kimiModeDescription列表中随机选择一条描述来替换原始的翻译文本。
 *              这可以用于在特定模式下为应用添加一些趣味性的随机文本。
 * @type {import('i18next').PostProcessorModule}
 */
const kimiPostProcessor = {
  type: 'postProcessor' as const, // 类型必须是 'postProcessor'
  name: 'kimi', // 处理器名称，用于在配置中引用
  process: (value: string, _key: string[], _options: any, translator: any) => {
    // 从Zustand store中获取当前kimi模式的状态
    const { kimiMode } = useSettingStore.getState();
    if (kimiMode) {
      // 如果开启了kimi模式
      // 从当前语言的'common'命名空间中获取随机描述列表
      const descriptions = translator.resourceStore.data[translator.language].common
        .kimiModeDescription as string[];
      // 随机选择一个索引
      const randomIndex = Math.floor(Math.random() * descriptions.length);
      // 返回随机选择的描述，替换原始的翻译值
      return descriptions[randomIndex];
    }
    // 如果未开启kimi模式，则返回原始的翻译值
    return value;
  },
};

i18n
  // --- 插件链 (Plugin Chaining) ---
  // 1. 使用自定义的后处理器
  .use(kimiPostProcessor)
  // 2. 使用浏览器语言检测插件，自动检测用户浏览器设置的语言
  .use(LanguageDetector)
  // 3. 使用React绑定插件，将i18n实例与React组件连接起来
  .use(initReactI18next)
  /**
   * @description i18next 初始化配置
   * @see https://www.i18next.com/overview/configuration-options 官方文档链接
   */
  .init({
    // --- 核心配置 ---
    debug: false, // 是否在控制台输出调试信息
    lng: 'zh', // 如果语言检测失败，默认使用的语言
    fallbackLng: 'zh', // 当当前语言没有对应的翻译时，回退到此语言

    // --- 命名空间 (Namespaces) ---
    // 定义应用中所有的翻译命名空间
    ns: [
      'common',
      'landing',
      'home',
      'damageCalculator',
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
      'multiPointBurst',
      'petCard',
      'petCard2',
      'petDictionary',
      'pmDataList',
      'poster',
      'tote',
      'petexchange',
      'badwordCheck',
      'expCalculator',
    ],
    defaultNS: 'common', // 默认的命名空间

    // --- 插值 (Interpolation) ---
    interpolation: {
      escapeValue: false, // React已经默认对输出进行XSS保护，所以这里不需要再次转义
    },

    // --- 后处理 (Post Processing) ---
    postProcess: ['kimi'], // 启用名为'kimi'的后处理器

    // --- 资源 (Resources) ---
    // 定义所有语言的翻译资源
    resources: {
      // 英文资源
      en: {
        common: enCommon,
        landing: enLanding,
        home: enHome,
        damageCalculator: enDamageCalculator,
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
        multiPointBurst: enMultiPointBurst,
        petCard: enPetCard,
        petCard2: enPetCard2,
        petDictionary: enPetDictionary,
        pmDataList: enPmDataList,
        poster: enPoster,
        tote: enTote,
        petexchange: enPetExchange,
        badwordCheck: enBadwordCheck,
        expCalculator: enExpCalculator,
      },
      // 中文资源
      zh: {
        common: zhCommon,
        landing: zhLanding,
        home: zhHome,
        damageCalculator: zhDamageCalculator,
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
        multiPointBurst: zhMultiPointBurst,
        petCard: zhPetCard,
        petCard2: zhPetCard2,
        petDictionary: zhPetDictionary,
        pmDataList: zhPmDataList,
        poster: zhPoster,
        tote: zhTote,
        petexchange: zhPetExchange,
        badwordCheck: zhBadwordCheck,
        expCalculator: zhExpCalculator,
      },
    },
  });

export default i18n;
