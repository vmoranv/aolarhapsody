import React from 'react';
import { Modal, Typography } from 'antd';
import { DataItem } from './DataView';

const { Title } = Typography;

/**
 * @description DetailDialog 组件的 props
 * @template T - 泛型，必须继承自 DataItem
 * @property {T | null} item - 要显示的物品数据
 * @property {boolean} visible - 是否可见
 * @property {() => void} onClose - 关闭弹窗的回调函数
 * @property {(item: T) => React.ReactNode} renderContent - 渲染弹窗内容的函数
 */
interface DetailDialogProps<T extends DataItem> {
  item: T | null;
  visible: boolean;
  onClose: () => void;
  renderContent: (item: T) => React.ReactNode;
}

/**
 * @description 详情弹窗组件
 * @template T - 泛型，必须继承自 DataItem
 * @param {DetailDialogProps<T>} props - 组件 props
 * @returns {React.ReactElement | null} - 渲染的组件
 */
const DetailDialog = <T extends DataItem>({
  item,
  visible,
  onClose,
  renderContent,
}: DetailDialogProps<T>) => {
  if (!item) {
    return null;
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<Title level={3}>{item.name}</Title>}
    >
      {renderContent(item)}
    </Modal>
  );
};

export default DetailDialog;
