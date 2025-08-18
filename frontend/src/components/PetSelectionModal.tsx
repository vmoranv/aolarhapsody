import { Modal } from 'antd';
import React from 'react';
import { DataItem } from '../types/DataItem';
import DataView from './DataView';
import ItemCard from './ItemCard';

interface PetSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (raceId: string) => void;
}

const PetSelectionModal: React.FC<PetSelectionModalProps> = ({ visible, onClose, onSelect }) => {
  const handlePetSelect = (pet: DataItem) => {
    onSelect(pet.id.toString());
    onClose();
  };

  return (
    <Modal
      title="选择一个亚比"
      open={visible}
      onCancel={onClose}
      footer={null}
      width="80vw"
      destroyOnHidden
    >
      <DataView
        queryKey={['pets-all']}
        dataUrl="pets"
        renderCard={(item, index) => (
          <div onClick={() => handlePetSelect(item)} style={{ cursor: 'pointer' }}>
            <ItemCard item={item} index={index} />
          </div>
        )}
        getSearchableFields={(item) => [item.name]}
        searchPlaceholder="搜索亚比..."
        loadingText="正在加载亚比列表..."
        errorText="加载亚比列表失败"
        paginationTotalText={(start, end, total) => `显示 ${start}-${end} of ${total} 个亚比`}
        noResultsText="未找到匹配的亚比"
        noDataText="没有可用的亚比数据"
        showingText={(filteredCount, totalCount) => `找到 ${filteredCount} / ${totalCount} 个亚比`}
        resetText="重置筛选"
        noLayout
      />
    </Modal>
  );
};

export default PetSelectionModal;
