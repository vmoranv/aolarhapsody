# 组件介绍

Aolarhapsody 使用现代化的前端技术构建用户界面,主要包括 Ant Design 组件库和自定义组件.本文档将介绍这些组件的定义和使用方法.

## 组件使用方式

在 Aolarhapsody 项目中,所有组件都使用 React 和 TypeScript 编写.要使用这些组件,首先需要从对应的文件中导入它们：

```tsx
import { Button } from 'antd'; // 使用 Ant Design 组件
import { AttributeCard } from '@/components/AttributeCard'; // 使用自定义组件
```

其中 `@` 是项目的别名,指向 `frontend/src` 目录.

## 自定义组件

项目中包含多个自定义组件以满足特定的业务需求.以下是对每个组件的详细说明和使用示例：

### AttributeCard 属性卡片

用于展示宠物或物品的属性信息.

**Props:**

- `attribute`: 包含属性数据的对象,具有 `id`、`name` 和 `isSuper` 属性
- `imageUrl`: 属性图片的 URL
- `index`: 列表中的索引,用于动画效果

**使用示例：**

```tsx
import AttributeCard from '@/components/AttributeCard';

function AttributeList() {
  const attributes = [
    { id: 1, name: '火', isSuper: true },
    { id: 2, name: '水', isSuper: false },
  ];

  return (
    <div>
      {attributes.map((attr, index) => (
        <AttributeCard
          key={attr.id}
          attribute={attr}
          imageUrl={`/images/attributes/${attr.id}.png`}
          index={index}
        />
      ))}
    </div>
  );
}
```

### ConfigList 配置列表

一个用于管理配置列表的组件,具有添加/删除功能.

**Props:**

- `title`: 配置列表的标题
- `items`: 配置项数组
- `onAddItem`: 添加新项的函数
- `onRemoveItem`: 根据 ID 删除项的函数
- `onUpdateItem`: 更新项值的函数
- `placeholder`: 输入框的占位符文本

**使用示例：**

```tsx
import ConfigList from '@/components/ConfigList';
import { useState } from 'react';

function ConfigManager() {
  const [items, setItems] = useState([{ id: '1', value: '' }]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), value: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, value } : item)));
  };

  return (
    <ConfigList
      title="配置项"
      items={items}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      onUpdateItem={updateItem}
      placeholder="请输入配置值"
    />
  );
}
```

### DataView 数据视图

一个通用的数据展示组件,具有搜索、过滤和分页功能.

**Props:**

- `queryKey`: 数据获取的查询键
- `dataUrl`: 获取数据的 URL
- `data`: 本地数据数组
- `renderCard`: 渲染每个数据项的函数
- `renderDetailDialog`: 渲染详细视图的函数
- `onCardClick`: 卡片被点击时调用的函数
- `getSearchableFields`: 指定可搜索字段的函数
- `getQuality`: 获取项目质量的函数
- `statsCalculators`: 包含计算统计信息函数的对象
- `searchPlaceholder`: 搜索输入框的占位符文本
- `noLayout`: 是否在没有布局的情况下渲染
- `loadingText`: 加载期间显示的文本
- `errorText`: 出错时显示的文本
- `paginationTotalText`: 格式化分页文本的函数
- `noResultsText`: 未找到结果时显示的文本
- `noDataText`: 没有数据时显示的文本
- `filterOptions`: 可用的过滤选项
- `resetText`: 重置按钮的文本
- `showingText`: 格式化计数文本的函数

**使用示例：**

```tsx
import DataView from '@/components/DataView';

function PetList() {
  return (
    <DataView
      queryKey={['pets']}
      dataUrl="pets"
      renderCard={(pet, index) => (
        <div key={pet.id}>
          <h3>{pet.name}</h3>
          <p>ID: {pet.id}</p>
        </div>
      )}
      getSearchableFields={(pet) => [pet.name]}
      searchPlaceholder="搜索宠物..."
      loadingText="正在加载宠物..."
      errorText="加载宠物失败"
      paginationTotalText={(start, end, total) => `显示 ${start}-${end} / ${total} 个宠物`}
      noResultsText="未找到宠物"
      noDataText="没有宠物数据"
      resetText="重置筛选"
      showingText={(filteredCount, totalCount) => `找到 ${filteredCount} / ${totalCount} 个宠物`}
    />
  );
}
```

### DetailDialog 详情对话框

用于显示详细信息的模态对话框.

**Props:**

- `item`: 要显示详细信息的项目
- `visible`: 对话框是否可见
- `onClose`: 关闭对话框的函数
- `renderContent`: 渲染内容的函数

**使用示例：**

```tsx
import DetailDialog from '@/components/DetailDialog';
import { useState } from 'react';

function ItemWithDetail() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDetail = (item) => {
    setSelectedItem(item);
    setDialogVisible(true);
  };

  const renderDialogContent = (item) => (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
    </div>
  );

  return (
    <>
      <button onClick={() => showDetail({ id: 1, name: '示例项目' })}>显示详情</button>
      <DetailDialog
        item={selectedItem}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        renderContent={renderDialogContent}
      />
    </>
  );
}
```

### ErrorDisplay 错误展示

用于显示错误信息.

**Props:**

- `error`: 要显示的错误消息
- `onRetry`: 重试操作的函数

**使用示例：**

```tsx
import ErrorDisplay from '@/components/ErrorDisplay';

function ErrorHandler({ error, onRetry }) {
  return <ErrorDisplay error={error} onRetry={onRetry} />;
}
```

### ItemCard 物品卡片

用于展示游戏物品信息.

**Props:**

- `item`: 物品数据对象
- `index`: 列表中的索引,用于动画效果
- `children`: 子组件
- `imageUrl`: 物品图片的 URL
- `icon`: 要显示的图标元素
- `imageStyle`: 图片的自定义样式

**使用示例：**

```tsx
import ItemCard from '@/components/ItemCard';

function ItemList() {
  const items = [
    { id: 1, name: '剑', quality: 3 },
    { id: 2, name: '盾', quality: 2 },
  ];

  return (
    <div>
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          item={item}
          index={index}
          imageUrl={`/images/items/${item.id}.png`}
        />
      ))}
    </div>
  );
}
```

### Layout 布局

应用程序的主要布局组件,包括顶部导航、侧边栏和内容区域.

**Props:**

- `children`: 子组件

**使用示例：**

```tsx
import Layout from '@/components/Layout';

function App() {
  return (
    <Layout>
      <h1>页面内容</h1>
      <p>此内容将在主布局中渲染.</p>
    </Layout>
  );
}
```

### LoadingSpinner 加载指示器

页面加载指示器组件.

**Props:**

- `text`: 要显示的加载文本
- `size`: 指示器的大小 ('small', 'default', 或 'large')

**使用示例：**

```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

function LoadingState() {
  return <LoadingSpinner text="正在加载数据..." size="large" />;
}
```

### MainContent 主内容

设置应用程序路由和主题的主内容区域组件.

**Props:**
无

**使用示例：**

```tsx
import MainContent from '@/components/MainContent';

function App() {
  return <MainContent />;
}
```

### NotificationDropdown 通知下拉菜单

用于显示系统通知的下拉组件.

**Props:**

- `notifications`: 通知项数组
- `onMarkAsRead`: 将通知标记为已读的函数
- `onMarkAllAsRead`: 将所有通知标记为已读的函数
- `onRemove`: 删除通知的函数
- `onClearAll`: 清除所有通知的函数

**使用示例：**

```tsx
import NotificationDropdown from '@/components/NotificationDropdown';

function Header() {
  const notifications = [
    {
      id: '1',
      type: 'info',
      title: '新消息',
      message: '您有一条新消息',
      timestamp: new Date(),
      read: false,
    },
  ];

  return (
    <header>
      <NotificationDropdown
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onRemove={remove}
        onClearAll={clearAll}
      />
    </header>
  );
}
```

### Overlay 遮罩

在目标元素周围创建孔洞的遮罩组件.

**Props:**

- `anchorRef`: 锚点元素的引用
- `onClick`: 点击遮罩时调用的函数
- `padding`: 锚点元素周围的填充

**使用示例：**

```tsx
import Overlay from '@/components/Overlay';
import { useRef } from 'react';

function OverlayDemo() {
  const buttonRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <button ref={buttonRef} onClick={() => setShowOverlay(true)}>
        显示遮罩
      </button>

      {showOverlay && (
        <Overlay anchorRef={buttonRef} onClick={() => setShowOverlay(false)} padding={8} />
      )}
    </>
  );
}
```

### PerformanceMonitor 性能监控

用于监控应用程序性能指标的组件.

**Props:**
无

**使用示例：**

```tsx
import PerformanceMonitor from '@/components/PerformanceMonitor';

function App() {
  return (
    <div>
      <h1>我的应用</h1>
      <PerformanceMonitor />
    </div>
  );
}
```

### PetSelectionModal 宠物选择模态框

用于选择宠物的模态框组件.

**Props:**

- `visible`: 可见性状态
- `onClose`: 关闭模态框的函数
- `onSelect`: 选择宠物时调用的函数

**使用示例：**

```tsx
import PetSelectionModal from '@/components/PetSelectionModal';
import { useState } from 'react';

function PetSelector() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (raceId) => {
    setModalVisible(false);
  };

  return (
    <>
      <button onClick={() => setModalVisible(true)}>选择宠物</button>
      <PetSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
```

### RadialMenu 径向菜单

用于显示快速操作的圆形径向菜单组件.

**Props:**

- `petConfig`: 宠物的配置
- `anchorRef`: 锚点元素的引用
- `onClose`: 关闭菜单的函数
- `onSwap`: 交换宠物的函数

**使用示例：**

```tsx
import RadialMenu from '@/components/RadialMenu';
import { useRef, useState } from 'react';

function PetCard() {
  const cardRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const petConfig = {
    /* 宠物配置 */
  };

  const handleClose = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <div ref={cardRef} onClick={() => setMenuVisible(true)}>
        宠物卡片
      </div>

      {menuVisible && (
        <RadialMenu
          petConfig={petConfig}
          anchorRef={cardRef}
          onClose={handleClose}
          onSwap={handleSwap}
        />
      )}
    </>
  );
}
```

### SearchAndFilter 搜索和过滤

提供搜索和过滤功能的组件.

**Props:**

- `searchPlaceholder`: 搜索输入框的占位符文本
- `filterOptions`: 可用的过滤选项
- `resetText`: 重置按钮的文本
- `showingText`: 显示结果计数的文本
- `hideFilter`: 是否隐藏过滤器

**使用示例：**

```tsx
import SearchAndFilter from '@/components/SearchAndFilter';

function SearchableList() {
  const filterOptions = [
    { label: '全部', value: 'all' },
    { label: '激活', value: 'active' },
    { label: '未激活', value: 'inactive' },
  ];

  return (
    <SearchAndFilter
      searchPlaceholder="搜索项目..."
      filterOptions={filterOptions}
      resetText="重置"
      showingText="显示 10 / 100 个项目"
    />
  );
}
```

### SettingsDrawer 设置抽屉

应用程序设置的抽屉组件.

**Props:**

- `open`: 抽屉是否打开
- `onClose`: 关闭抽屉的函数
- `currentPageStatus`: 当前页面的状态

**使用示例：**

```tsx
import SettingsDrawer from '@/components/SettingsDrawer';
import { useState } from 'react';

function SettingsButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <button onClick={() => setDrawerOpen(true)}>打开设置</button>
      <SettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPageStatus="release"
      />
    </>
  );
}
```

### SkillCard 技能卡片

用于展示技能信息.

**Props:**

- `skillId`: 技能的 ID
- `unlockLevel`: 解锁技能的等级

**使用示例：**

```tsx
import SkillCard from '@/components/SkillCard';

function SkillList() {
  const skills = [
    { id: '1', level: '10' },
    { id: '2', level: '20' },
  ];

  return (
    <div>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skillId={skill.id} unlockLevel={skill.level} />
      ))}
    </div>
  );
}
```

### ThemeToggle 主题切换

用于切换网站主题的组件.

**Props:**
无

**使用示例：**

```tsx
import ThemeToggle from '@/components/ThemeToggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### ViewSwitcher 视图切换器

用于在不同视图之间切换的组件.

**Props:**

- `views`: 包含键、标签和内容的视图对象数组

**使用示例：**

```tsx
import ViewSwitcher from '@/components/ViewSwitcher';

function MultiViewPage() {
  const views = [
    {
      key: 'view1',
      label: '视图1',
      content: <div>视图1的内容</div>,
    },
    {
      key: 'view2',
      label: '视图2',
      content: <div>视图2的内容</div>,
    },
  ];

  return <ViewSwitcher views={views} />;
}
```

所有这些组件都位于 `frontend/src/components` 目录下,可以根据需要进行复用和扩展.
