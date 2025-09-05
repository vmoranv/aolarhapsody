import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, List, Space } from 'antd';
import React from 'react';

interface ConfigItem {
  id: string;
  value: string;
}

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
