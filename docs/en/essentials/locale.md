# Internationalization

::: tip Note

The project uses i18next and react-i18next to implement internationalization functionality, supporting Chinese and English switching.

:::

## Internationalization Architecture

The project adopts i18next as the internationalization solution, with the following features:

- Support for multiple language switching
- On-demand language package loading
- Support for plural forms and context
- Deep integration with React components

### Core Dependencies

```json
{
  "dependencies": {
    "i18next": "^23.0.0",
    "react-i18next": "^13.0.0",
    "i18next-browser-languagedetector": "^7.0.0"
  }
}
```

## Configuration Implementation

### i18n Configuration File

```ts
// frontend/src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language resources
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
    fallbackLng: 'en-US',
    lng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

## Language Resource Files

Language resource files are organized by language and namespace:

```
frontend/src/locales/
├── en-US/
│   └── common.json
└── zh-CN/
    └── common.json
```

### Resource File Structure

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "messages": {
    "welcome": "Welcome, {{name}}!",
    "itemCount_one": "Found {{count}} item",
    "itemCount_other": "Found {{count}} items"
  }
}
```

## Usage in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('messages.welcome', { name: 'John' })}</p>
      <button onClick={() => changeLanguage('zh-CN')}>Switch to Chinese</button>
    </div>
  );
};
```

### Pluralization

```tsx
import { useTranslation } from 'react-i18next';

const ItemList: React.FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation('common');

  return <div>{t('messages.itemCount', { count })}</div>;
};
```

## Language Detection

The project supports automatic language detection with the following priority order:

1. URL parameter (?lng=en-US)
2. LocalStorage setting
3. Browser language
4. Default language (en-US)

### Custom Language Detector

```ts
// frontend/src/utils/languageDetector.ts
export const detectLanguage = (): string => {
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const lngParam = urlParams.get('lng');
  if (lngParam && ['en-US', 'zh-CN'].includes(lngParam)) {
    return lngParam;
  }

  // Check localStorage
  const storedLng = localStorage.getItem('i18nextLng');
  if (storedLng && ['en-US', 'zh-CN'].includes(storedLng)) {
    return storedLng;
  }

  // Default to English
  return 'en-US';
};
```

## Best Practices

1. **Key Naming**: Use descriptive and hierarchical key names
2. **Namespace Organization**: Organize translations by feature or module
3. **Context Handling**: Use context suffixes for different meanings
4. **Pluralization**: Properly handle plural forms for different languages
5. **Dynamic Loading**: Load language packages on demand to reduce bundle size

By following these practices, you can ensure a smooth internationalization experience for users in different language environments.
