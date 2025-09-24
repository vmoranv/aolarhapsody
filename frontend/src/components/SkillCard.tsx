import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Modal, Popover, Spin, Typography } from 'antd';
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

/**
 * @description 技能卡片组件，用于显示单个技能的信息
 * @param {{ skillId: string; unlockLevel: string }} props - 组件 props
 * @property {string} skillId - 技能 ID
 * @property {string} unlockLevel - 解锁等级
 * @returns {React.ReactElement | null} - 渲染的组件
 */
const SkillCard: React.FC<{ skillId: string; unlockLevel: string }> = ({
  skillId,
  unlockLevel,
}) => {
  // 状态：控制技能详情模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 使用React Query根据技能ID异步获取技能的详细数据
  const {
    data: skill,
    isLoading,
    error,
  } = useQuery<Skill, Error>({
    queryKey: ['skill', skillId], // 查询的唯一键
    queryFn: () => fetchSkillById(Number(skillId)), // 数据获取函数
    enabled: !!skillId, // 只有当skillId存在时才执行查询
  });

  // 使用React Query获取所有技能属性的列表，用于后续查找属性名称
  const { data: skillAttributes = [] } = useQuery<ProcessedAttribute[], Error>({
    queryKey: ['skillAttributes'],
    queryFn: fetchSkillAttributes,
    staleTime: Infinity, // 将数据设置为“永不过期”，因为属性列表是静态的
  });

  // 使用useMemo创建一个属性ID到名称的映射表，以优化性能，避免重复计算
  const attributeNameMap = React.useMemo(
    () => createAttributeNameMap(skillAttributes),
    [skillAttributes]
  );

  // 如果正在加载数据，则显示一个加载指示器
  if (isLoading) {
    return (
      <Card size="small" className="skill-item">
        <Spin size="small" />
      </Card>
    );
  }

  // 如果发生错误，则不渲染任何内容
  if (error) {
    return null;
  }

  // 如果技能数据不存在，则不渲染任何内容
  if (!skill) {
    return null;
  }

  /**
   * @description 显示技能详情模态框。
   */
  const showModal = () => {
    setIsModalVisible(true);
  };

  /**
   * @description 关闭技能详情模态框。
   */
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /**
   * @description 格式化技能描述文本。
   * 将换行符(\n)替换为HTML的<br />标签。
   * 将#...#标记的文本替换为<strong>...</strong>以实现高亮效果。
   * @param {string} desc - 原始描述文本。
   * @returns {string} - 格式化后的HTML字符串。
   */
  const formatDescription = (desc: string) => {
    if (!desc) {
      return '';
    }
    return desc.replace(/\n/g, '<br />').replace(/#([^#]+)#/g, '<strong>$1</strong>');
  };

  // 获取技能的属性名称和图标URL
  const attributeName = getAttributeName(skill.attributeType, attributeNameMap);
  const attributeIconUrl = getAttributeIconUrl(skill.attributeType);

  // Popover(悬浮提示)的内容，显示技能的简要描述
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
