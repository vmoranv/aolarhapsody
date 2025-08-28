# Components Introduction

Aolarhapsody uses modern frontend technologies to build the user interface, primarily including Ant Design component library and custom components. This document will introduce the definition and usage of these components.

## Component Usage

In the Aolarhapsody project, all components are written in React and TypeScript. To use these components, you first need to import them from the corresponding files:

```tsx
import { Button } from 'antd'; // Using Ant Design components
import { AttributeCard } from '@/components/AttributeCard'; // Using custom components
```

Where `@` is an alias for the project pointing to the [frontend/src](file:///c:/Users/Administrator/Desktop/tmp/aolarhapsody/frontend/src) directory.

## Custom Components

The project includes several custom components to meet specific business needs. Below are detailed descriptions and usage examples for each component:

### AttributeCard

Used to display attribute information of pets or items.

**Props:**

- `attribute`: Object containing attribute data with `id`, `name`, and `isSuper` properties
- `imageUrl`: URL of the attribute image
- `index`: Index in the list for animation purposes

**Usage Example:**

```tsx
import AttributeCard from '@/components/AttributeCard';

function AttributeList() {
  const attributes = [
    { id: 1, name: 'Fire', isSuper: true },
    { id: 2, name: 'Water', isSuper: false },
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

### ConfigList

A component for managing configuration lists with add/remove functionality.

**Props:**

- `title`: Title of the configuration list
- `items`: Array of configuration items
- `onAddItem`: Function to add a new item
- `onRemoveItem`: Function to remove an item by ID
- `onUpdateItem`: Function to update an item's value
- `placeholder`: Placeholder text for input fields

**Usage Example:**

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
      title="Configuration Items"
      items={items}
      onAddItem={addItem}
      onRemoveItem={removeItem}
      onUpdateItem={updateItem}
      placeholder="Enter configuration value"
    />
  );
}
```

### DataView

A general data display component with search, filtering, and pagination capabilities.

**Props:**

- `queryKey`: Query key for data fetching
- `dataUrl`: URL to fetch data from
- `data`: Local data array
- `renderCard`: Function to render each data item
- `renderDetailDialog`: Function to render detailed view
- `onCardClick`: Function called when a card is clicked
- `getSearchableFields`: Function to specify searchable fields
- `getQuality`: Function to get item quality
- `statsCalculators`: Object with functions to calculate statistics
- `searchPlaceholder`: Placeholder text for search input
- `noLayout`: Whether to render without layout
- `loadingText`: Text to show during loading
- `errorText`: Text to show on error
- `paginationTotalText`: Function to format pagination text
- `noResultsText`: Text to show when no results found
- `noDataText`: Text to show when no data available
- `filterOptions`: Available filter options
- `resetText`: Text for reset button
- `showingText`: Function to format count text

**Usage Example:**

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
      searchPlaceholder="Search pets..."
      loadingText="Loading pets..."
      errorText="Failed to load pets"
      paginationTotalText={(start, end, total) => `Showing ${start}-${end} of ${total} pets`}
      noResultsText="No pets found"
      noDataText="No pet data available"
      resetText="Reset filters"
      showingText={(filteredCount, totalCount) => `Found ${filteredCount} of ${totalCount} pets`}
    />
  );
}
```

### DetailDialog

A modal dialog for displaying detailed information.

**Props:**

- `item`: The item to display details for
- `visible`: Whether the dialog is visible
- `onClose`: Function to close the dialog
- `renderContent`: Function to render the content

**Usage Example:**

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
      <button onClick={() => showDetail({ id: 1, name: 'Example Item' })}>Show Detail</button>
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

### ErrorDisplay

Used to display error information.

**Props:**

- `error`: Error message to display
- `onRetry`: Function to retry the operation

**Usage Example:**

```tsx
import ErrorDisplay from '@/components/ErrorDisplay';

function ErrorHandler({ error, onRetry }) {
  return <ErrorDisplay error={error} onRetry={onRetry} />;
}
```

### ItemCard

Used to display game item information.

**Props:**

- `item`: Item data object
- `index`: Index in the list for animation
- `children`: Child components
- `imageUrl`: URL of the item image
- `icon`: Icon element to display
- `imageStyle`: Custom styles for the image

**Usage Example:**

```tsx
import ItemCard from '@/components/ItemCard';

function ItemList() {
  const items = [
    { id: 1, name: 'Sword', quality: 3 },
    { id: 2, name: 'Shield', quality: 2 },
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

### Layout

The main layout component of the application, including top navigation, sidebar, and content area.

**Props:**

- `children`: Child components

**Usage Example:**

```tsx
import Layout from '@/components/Layout';

function App() {
  return (
    <Layout>
      <h1>Page Content</h1>
      <p>This content will be rendered within the main layout.</p>
    </Layout>
  );
}
```

### LoadingSpinner

Page loading indicator component.

**Props:**

- `text`: Loading text to display
- `size`: Size of the spinner ('small', 'default', or 'large')

**Usage Example:**

```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

function LoadingState() {
  return <LoadingSpinner text="Loading data..." size="large" />;
}
```

### MainContent

Main content area component that sets up the application's routing and theme.

**Props:**
None

**Usage Example:**

```tsx
import MainContent from '@/components/MainContent';

function App() {
  return <MainContent />;
}
```

### NotificationDropdown

Dropdown component for displaying system notifications.

**Props:**

- `notifications`: Array of notification items
- `onMarkAsRead`: Function to mark a notification as read
- `onMarkAllAsRead`: Function to mark all notifications as read
- `onRemove`: Function to remove a notification
- `onClearAll`: Function to clear all notifications

**Usage Example:**

```tsx
import NotificationDropdown from '@/components/NotificationDropdown';

function Header() {
  const notifications = [
    {
      id: '1',
      type: 'info',
      title: 'New Message',
      message: 'You have a new message',
      timestamp: new Date(),
      read: false,
    },
  ];

  const markAsRead = (id) => {
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    console.log('Marking all notifications as read');
  };

  const remove = (id) => {
    console.log(`Removing notification ${id}`);
  };

  const clearAll = () => {
    console.log('Clearing all notifications');
  };

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

### Overlay

An overlay component that creates a hole around a target element.

**Props:**

- `anchorRef`: Reference to the anchor element
- `onClick`: Function called when overlay is clicked
- `padding`: Padding around the anchor element

**Usage Example:**

```tsx
import Overlay from '@/components/Overlay';
import { useRef } from 'react';

function OverlayDemo() {
  const buttonRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <button ref={buttonRef} onClick={() => setShowOverlay(true)}>
        Show Overlay
      </button>

      {showOverlay && (
        <Overlay anchorRef={buttonRef} onClick={() => setShowOverlay(false)} padding={8} />
      )}
    </>
  );
}
```

### PerformanceMonitor

A component for monitoring application performance metrics.

**Props:**
None

**Usage Example:**

```tsx
import PerformanceMonitor from '@/components/PerformanceMonitor';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <PerformanceMonitor />
    </div>
  );
}
```

### PetSelectionModal

Modal component for selecting pets.

**Props:**

- `visible`: Visibility state
- `onClose`: Function to close the modal
- `onSelect`: Function called when a pet is selected

**Usage Example:**

```tsx
import PetSelectionModal from '@/components/PetSelectionModal';
import { useState } from 'react';

function PetSelector() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (raceId) => {
    console.log(`Selected pet with race ID: ${raceId}`);
    setModalVisible(false);
  };

  return (
    <>
      <button onClick={() => setModalVisible(true)}>Select Pet</button>
      <PetSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
```

### RadialMenu

Circular radial menu component for displaying quick actions.

**Props:**

- `petConfig`: Configuration for the pet
- `anchorRef`: Reference to the anchor element
- `onClose`: Function to close the menu
- `onSwap`: Function to swap the pet

**Usage Example:**

```tsx
import RadialMenu from '@/components/RadialMenu';
import { useRef, useState } from 'react';

function PetCard() {
  const cardRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const petConfig = {
    /* pet configuration */
  };

  const handleClose = () => {
    setMenuVisible(false);
  };

  const handleSwap = () => {
    console.log('Swapping pet');
  };

  return (
    <>
      <div ref={cardRef} onClick={() => setMenuVisible(true)}>
        Pet Card
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

### SearchAndFilter

Component providing search and filtering functionality.

**Props:**

- `searchPlaceholder`: Placeholder text for search input
- `filterOptions`: Available filter options
- `resetText`: Text for reset button
- `showingText`: Text showing results count
- `hideFilter`: Whether to hide the filter

**Usage Example:**

```tsx
import SearchAndFilter from '@/components/SearchAndFilter';

function SearchableList() {
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <SearchAndFilter
      searchPlaceholder="Search items..."
      filterOptions={filterOptions}
      resetText="Reset"
      showingText="Showing 10 of 100 items"
    />
  );
}
```

### SettingsDrawer

A drawer component for application settings.

**Props:**

- `open`: Whether the drawer is open
- `onClose`: Function to close the drawer
- `currentPageStatus`: Status of the current page

**Usage Example:**

```tsx
import SettingsDrawer from '@/components/SettingsDrawer';
import { useState } from 'react';

function SettingsButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <button onClick={() => setDrawerOpen(true)}>Open Settings</button>
      <SettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPageStatus="release"
      />
    </>
  );
}
```

### SkillCard

Used to display skill information.

**Props:**

- `skillId`: ID of the skill
- `unlockLevel`: Level at which the skill is unlocked

**Usage Example:**

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

### ThemeToggle

Component for switching website themes.

**Props:**
None

**Usage Example:**

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

### ViewSwitcher

A component for switching between different views.

**Props:**

- `views`: Array of view objects with key, label, and content

**Usage Example:**

```tsx
import ViewSwitcher from '@/components/ViewSwitcher';

function MultiViewPage() {
  const views = [
    {
      key: 'view1',
      label: 'View 1',
      content: <div>Content for View 1</div>,
    },
    {
      key: 'view2',
      label: 'View 2',
      content: <div>Content for View 2</div>,
    },
  ];

  return <ViewSwitcher views={views} />;
}
```

All these components are located in the [frontend/src/components](file:///c:/Users/Administrator/Desktop/tmp/aolarhapsody/frontend/src/components) directory and can be reused and extended as needed.
