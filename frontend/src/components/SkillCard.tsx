import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Modal, Popover, Spin, Typography } from 'antd';
import React, { useState } from 'react';
import { getAttributeIconUrl, ProcessedAttribute } from '../utils/attribute-helper';
import { getAttributeName } from '../utils/pet-dictionary-helper';
import {
  createAttributeNameMap,
  fetchSkillAttributes,
  fetchSkillById,
  Skill,
} from '../utils/pet-helper';
import './SkillCard.css';

const { Text } = Typography;

const SkillCard: React.FC<{ skillId: string; unlockLevel: string }> = ({
  skillId,
  unlockLevel,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: skill,
    isLoading,
    error,
  } = useQuery<Skill, Error>({
    queryKey: ['skill', skillId],
    queryFn: () => fetchSkillById(Number(skillId)),
    enabled: !!skillId,
  });

  const { data: skillAttributes = [] } = useQuery<ProcessedAttribute[], Error>({
    queryKey: ['skillAttributes'],
    queryFn: fetchSkillAttributes,
    staleTime: Infinity,
  });

  const attributeNameMap = React.useMemo(
    () => createAttributeNameMap(skillAttributes),
    [skillAttributes]
  );

  if (isLoading) {
    return (
      <Card size="small" className="skill-item">
        <Spin size="small" />
      </Card>
    );
  }

  if (error) {
    return null;
  }

  if (!skill) {
    return null;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatDescription = (desc: string) => {
    if (!desc) return '';
    return desc.replace(/\n/g, '<br />').replace(/#([^#]+)#/g, '<strong>$1</strong>');
  };

  const attributeName = getAttributeName(skill.attributeType, attributeNameMap);
  const attributeIconUrl = getAttributeIconUrl(skill.attributeType);

  const popoverContent = (
    <div
      className="skill-details-popover"
      dangerouslySetInnerHTML={{
        __html: formatDescription(skill.newEffectDesc || skill.oldEffectDesc || skill.clientDesc),
      }}
    />
  );

  return (
    <>
      <Popover content={popoverContent} placement="right" trigger="hover">
        <Card size="small" className="skill-item" onClick={showModal}>
          <div className="skill-card-header">
            <Text strong>{skill.newCnName}</Text>
            <div className="skill-attribute-tag">
              <img src={attributeIconUrl} alt={attributeName} className="attribute-icon" />
            </div>
          </div>
          <div className="skill-card-body">
            <Text type="secondary">威力: {skill.power}</Text>
            <Text type="secondary">PP: {skill.allPP}</Text>
            <Text type="secondary">等级: {unlockLevel}</Text>
          </div>
        </Card>
      </Popover>
      <Modal
        title={skill.newCnName}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        className="skill-modal"
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '16px' }}>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="ID" span={2}>
              {skill.id}
            </Descriptions.Item>
            <Descriptions.Item label="威力">{skill.power}</Descriptions.Item>
            <Descriptions.Item label="PP">{skill.allPP}</Descriptions.Item>
            <Descriptions.Item label="命中">
              {skill.hitRate === 0 ? '必中' : skill.hitRate}
            </Descriptions.Item>
            <Descriptions.Item label="先发度">{skill.PRI}</Descriptions.Item>
            <Descriptions.Item label="类型">
              {skill.attackType === 1 ? '物理' : '特殊'}
            </Descriptions.Item>
            <Descriptions.Item label="暴击率">{skill.critRate}%</Descriptions.Item>
            <Descriptions.Item label="效果" span={2}>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatDescription(
                    skill.newEffectDesc || skill.oldEffectDesc || skill.clientDesc
                  ),
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </>
  );
};

export default SkillCard;
