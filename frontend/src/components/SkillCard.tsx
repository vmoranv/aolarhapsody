import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Popover, Spin, Typography } from 'antd';
import React from 'react';
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

const SkillCard: React.FC<{ skillId: string }> = ({ skillId }) => {
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
    return (
      <Card size="small" className="skill-item skill-item-error">
        <Text type="danger">加载失败</Text>
      </Card>
    );
  }

  if (!skill) {
    return null;
  }

  const attributeName = getAttributeName(skill.attributeType, attributeNameMap);
  const attributeIconUrl = getAttributeIconUrl(skill.attributeType);

  const skillDetails = (
    <div className="skill-details-popover">
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="ID" span={2}>
          {skill.id}
        </Descriptions.Item>
        <Descriptions.Item label="名称" span={2}>
          {skill.newCnName}
        </Descriptions.Item>
        <Descriptions.Item label="威力">{skill.power}</Descriptions.Item>
        <Descriptions.Item label="PP">{skill.allPP}</Descriptions.Item>
        <Descriptions.Item label="命中">
          {skill.hitRate === 0 ? '必中' : skill.hitRate}
        </Descriptions.Item>
        <Descriptions.Item label="先发度">{skill.PRI}</Descriptions.Item>
        <Descriptions.Item label="类型" span={2}>
          {skill.attackType === 1 ? '物理' : '特殊'}
        </Descriptions.Item>
        <Descriptions.Item label="暴击率" span={2}>
          {skill.critRate}%
        </Descriptions.Item>
        <Descriptions.Item label="效果" span={2}>
          {skill.clientDesc}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <Popover content={skillDetails} placement="right" trigger="hover">
      <Card size="small" className="skill-item">
        <div className="skill-card-header">
          <Text strong>{skill.newCnName}</Text>
          <div className="skill-attribute-tag">
            <img src={attributeIconUrl} alt={attributeName} className="attribute-icon" />
          </div>
        </div>
        <div className="skill-card-body">
          <Text type="secondary">威力: {skill.power}</Text>
          <Text type="secondary">PP: {skill.allPP}</Text>
        </div>
      </Card>
    </Popover>
  );
};

export default SkillCard;
