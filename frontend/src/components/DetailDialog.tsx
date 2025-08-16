import { Modal, Typography } from 'antd';
import React from 'react';
import { DataItem } from './DataView';

const { Title } = Typography;

interface DetailDialogProps<T extends DataItem> {
  item: T | null;
  visible: boolean;
  onClose: () => void;
  renderContent: (item: T) => React.ReactNode;
}

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
