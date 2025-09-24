import React from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, List, Space } from 'antd';

/**
 * @description 配置项的接口
 * @interface ConfigItem
 * @property {string} id - 配置项的唯一标识
 * @property {string} value - 配置项的值
 */
interface ConfigItem {
  id: string;
  value: string;
}

/**
 * @description ConfigList 组件的 props 接口
 * @interface ConfigListProps
 * @property {string} title - 列表标题
 * @property {ConfigItem[]} items - 配置项数组
 * @property {() => void} onAddItem - 添加配置项的回调函数
 * @property {(id: string) => void} onRemoveItem - 删除配置项的回调函数
 * @property {(id: string, value: string) => void} onUpdateItem - 更新配置项的回调函数
 * @property {string} [placeholder] - 输入框的占位符文本
 * @property {(item: ConfigItem, onUpdate: (value: string) => void, onRemove: () => void) => React.ReactNode} [renderItem] - 自定义渲染列表项的函数
 */
interface ConfigListProps {
  title: string;
  items: ConfigItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, value: string) => void;
  placeholder?: string;
  renderItem?: (
    item: ConfigItem,
    onUpdate: (value: string) => void,
    onRemove: () => void
  ) => React.ReactNode;
}

/**
 * @description 一个可复用的配置列表组件，用于显示、添加、删除和更新配置项
 * @param {ConfigListProps} props - 组件 props
 */
const ConfigList: React.FC<ConfigListProps> = ({
  title,
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  placeholder = '请输入ID',
  renderItem: customRenderItem,
}) => {
  return (
    <List
      header={<div>{title}</div>}
      footer={
        <Button type="dashed" onClick={onAddItem} block icon={<PlusOutlined />}>
          添加
        </Button>
      }
      bordered
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          {customRenderItem ? (
            customRenderItem(
              item,
              (value) => onUpdateItem(item.id, value),
              () => onRemoveItem(item.id)
            )
          ) : (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder={placeholder}
                value={item.value}
                onChange={(e) => onUpdateItem(item.id, e.target.value)}
              />
              <Button icon={<DeleteOutlined />} onClick={() => onRemoveItem(item.id)} danger />
            </Space.Compact>
          )}
        </List.Item>
      )}
    />
  );
};

export default ConfigList;
