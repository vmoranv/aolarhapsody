# 国际化

::: tip 说明

项目使用 i18next 和 react-i18next 实现国际化功能,支持中英文切换.

:::

## 国际化架构

项目采用 i18next 作为国际化解决方案,具有以下特点：

- 支持多种语言切换
- 按需加载语言包
- 支持复数形式和上下文
- 与 React 组件深度集成

### 核心依赖

```json
{
  "dependencies": {
    "i18next": "^23.0.0",
    "react-i18next": "^13.0.0",
    "i18next-browser-languagedetector": "^7.0.0"
  }
}
```

## 配置实现

### i18n 配置文件

```ts
// frontend/src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 语言资源
import zhCN from '@/locales/zh-CN/common.json';
import enUS from '@/locales/en-US/common.json';

const resources = {
  'zh-CN': {
    common: zhCN,
  },
  'en-US': {
    common: enUS,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    lng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
```

### 语言资源文件

#### 中文资源文件

```json
// frontend/src/locales/zh-CN/common.json
{
  "app": {
    "title": "奥拉星图鉴",
    "description": "奥拉星游戏数据分析平台"
  },
  "navigation": {
    "home": "首页",
    "pets": "亚比图鉴",
    "items": "道具列表",
    "calculator": "计算器"
  },
  "pet": {
    "name": "名称",
    "type": "属性",
    "rarity": "稀有度",
    "stats": "种族值",
    "skills": "技能"
  },
  "actions": {
    "search": "搜索",
    "filter": "筛选",
    "reset": "重置"
  }
}
```

#### 英文资源文件

```json
// frontend/src/locales/en-US/common.json
{
  "app": {
    "title": "Aola Rhapsody",
    "description": "Aola Star Game Data Analysis Platform"
  },
  "navigation": {
    "home": "Home",
    "pets": "Pet Dictionary",
    "items": "Item List",
    "calculator": "Calculator"
  },
  "pet": {
    "name": "Name",
    "type": "Type",
    "rarity": "Rarity",
    "stats": "Stats",
    "skills": "Skills"
  },
  "actions": {
    "search": "Search",
    "filter": "Filter",
    "reset": "Reset"
  }
}
```

## 使用方式

### 在组件中使用翻译

```tsx
// frontend/src/components/Header.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>

      <div>
        <button onClick={() => changeLanguage('zh-CN')}>中文</button>
        <button onClick={() => changeLanguage('en-US')}>English</button>
      </div>
    </header>
  );
};

export default Header;
```

### 带参数的翻译

```json
// 资源文件
{
  "messages": {
    "welcome": "欢迎, {{name}}!",
    "itemCount": "找到 {{count}} 个项目",
    "itemCount_plural": "找到 {{count}} 个项目"
  }
}
```

```tsx
// 在组件中使用
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <p>{t('messages.welcome', { name: '玩家' })}</p>
      <p>{t('messages.itemCount', { count: 5 })}</p>
    </div>
  );
};
```

### 嵌套翻译

```json
// 资源文件
{
  "navigation": {
    "home": "首页",
    "pets": {
      "title": "亚比图鉴",
      "all": "全部亚比",
      "favorites": "我的收藏"
    }
  }
}
```

```tsx
// 在组件中使用
const Navigation: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <nav>
      <a href="/">{t('navigation.home')}</a>
      <a href="/pets">{t('navigation.pets.title')}</a>
      <a href="/pets/favorites">{t('navigation.pets.favorites')}</a>
    </nav>
  );
};
```

## 多命名空间支持

### 创建命名空间

```ts
// frontend/src/i18n.ts
const resources = {
  'zh-CN': {
    common: zhCN,
    pets: zhPets,
    items: zhItems,
    calculator: zhCalculator,
  },
  'en-US': {
    common: enUS,
    pets: enPets,
    items: enItems,
    calculator: enCalculator,
  },
};
```

### 使用特定命名空间

```tsx
import { useTranslation } from 'react-i18next';

// 使用默认命名空间 (common)
const { t } = useTranslation();

// 使用特定命名空间
const { t: tPets } = useTranslation('pets');
const { t: tItems } = useTranslation('items');

const MyComponent: React.FC = () => {
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <h2>{tPets('pet.stats')}</h2>
      <h3>{tItems('item.name')}</h3>
    </div>
  );
};
```

## 语言切换器

### 创建语言切换组件

```tsx
// frontend/src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en-US', label: 'English' },
  ];

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('i18nextLng', value);
  };

  return (
    <Select
      defaultValue={i18n.language}
      options={languages}
      onChange={handleChange}
      style={{ width: 120 }}
    />
  );
};

export default LanguageSwitcher;
```

## 动态加载语言包

### 按需加载实现

```ts
// frontend/src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 初始化仅加载默认语言包
i18n.use(initReactI18next).init({
  fallbackLng: 'zh-CN',
  lng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
});

// 动态加载其他语言包
export const loadLanguage = async (lng: string) => {
  if (i18n.hasResourceBundle(lng, 'common')) {
    return;
  }

  try {
    const resources = await import(`@/locales/${lng}/common.json`);
    i18n.addResourceBundle(lng, 'common', resources.default);
  } catch (error) {
    console.error(`Failed to load language resources for ${lng}:`, error);
  }
};
```

### 在组件中使用动态加载

```tsx
import { useTranslation } from 'react-i18next';
import { loadLanguage } from '@/i18n';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await loadLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('zh-CN')}>中文</button>
      <button onClick={() => changeLanguage('en-US')}>English</button>
    </div>
  );
};
```
