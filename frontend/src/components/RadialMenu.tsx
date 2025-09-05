import {
  DeleteOutlined,
  ExperimentOutlined,
  PlusOutlined,
  SettingOutlined,
  SwapOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Button, Input, Popover, Select, Space } from 'antd';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDamageCalculatorStore } from '../store/damageCalculator';
import type { PetConfig } from '../types/damageCalculator';
import {
  fetchPetCardSets,
  fetchPetRawDataById,
  fetchSkillById,
  splitToArray,
} from '../utils/pet-helper';
import ConfigList from './ConfigList';

const PRESET_CONFIG_NAMES = ['星灵', '晶钥', '神兵', '魂卡', '铭文', '装备', '特性晶石', '魂器'];

interface RadialMenuProps {
  petConfig: PetConfig;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSwap: () => void;
  onRemove: () => void;
}

interface MenuItemType {
  key: string;
  icon: React.ReactElement;
  color: string;
  title: string;
  angle?: number;
  popoverContent?: React.ReactElement;
  onClick?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -90 },
  visible: (angle: number) => {
    const radius = 80;
    const x = radius * Math.cos(angle * (Math.PI / 180));
    const y = radius * Math.sin(angle * (Math.PI / 180));
    return {
      opacity: 1,
      scale: 1,
      x: x - 20, // Offset by half of Avatar size (40px)
      y: y - 20,
      rotate: 0,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    };
  },
  exit: { opacity: 0, scale: 0.5, rotate: 90 },
};

const RadialMenu: React.FC<RadialMenuProps> = ({
  petConfig,
  anchorRef,
  onClose,
  onSwap,
  onRemove,
}) => {
  const {
    updatePetConfig,
    addOtherConfig,
    removeOtherConfig,
    updateOtherConfig,
    addSkill,
    removeSkill,
    updateSkill,
  } = useDamageCalculatorStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updatePosition = () => {
      if (anchorRef.current) {
        const anchorRect = anchorRef.current.getBoundingClientRect();
        setStyle({
          position: 'fixed',
          top: anchorRect.top + anchorRect.height / 2,
          left: anchorRect.left + anchorRect.width / 2,
          zIndex: 1001,
        });
      }
    };
    updatePosition();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('.ant-popover') || target.closest('.ant-select-dropdown')) {
        return;
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef, onClose]);

  // --- Data Fetching for Skill Select ---
  const { data: petRawData } = useQuery({
    queryKey: ['petRawData', petConfig.raceId],
    queryFn: () => fetchPetRawDataById(petConfig.raceId),
    enabled: !!petConfig.raceId,
  });

  const skillIds = useMemo(() => {
    if (!petRawData) {
      return [];
    }
    const newSkills = splitToArray(petRawData[87] as string);
    const oldSkills = splitToArray(petRawData[29] as string);
    const allSkillStrings = [...newSkills, ...oldSkills];
    return allSkillStrings.map((s) => s.split('-').pop()!).filter(Boolean);
  }, [petRawData]);

  const { data: skillsData } = useQuery({
    queryKey: ['skillsDetails', skillIds],
    queryFn: () => Promise.all(skillIds.map((id) => fetchSkillById(Number(id)))),
    enabled: skillIds.length > 0,
  });

  const skillOptions = useMemo(() => {
    if (!skillsData) {
      return [];
    }
    return skillsData.map((skill) => ({
      label: skill.cnName || skill.enName,
      value: skill.id.toString(),
    }));
  }, [skillsData]);

  const availableConfigNames = useMemo(() => {
    const existingNames = new Set(petConfig.otherConfigs.map((c) => c.name));
    return PRESET_CONFIG_NAMES.filter((name) => !existingNames.has(name));
  }, [petConfig.otherConfigs]);

  // --- Popover Contents ---
  const skillContent = (
    <div style={{ width: 280 }}>
      <ConfigList
        title="技能配置"
        items={petConfig.skills.map((s) => ({ id: s.id, value: s.skillId }))}
        onAddItem={() => addSkill(petConfig.id)}
        onRemoveItem={(skillId) => removeSkill(petConfig.id, skillId)}
        onUpdateItem={(skillId, newSkillId) => updateSkill(petConfig.id, skillId, newSkillId)}
        placeholder="请选择技能"
        renderItem={(item, onUpdate, onRemove) => (
          <Space.Compact style={{ width: '100%' }}>
            <Select
              showSearch
              style={{ width: '100%' }}
              value={item.value}
              onChange={onUpdate}
              options={skillOptions}
              loading={!skillsData}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
            <Button icon={<DeleteOutlined />} onClick={onRemove} danger />
          </Space.Compact>
        )}
      />
    </div>
  );

  const { data: petCardSets } = useQuery({
    queryKey: ['petCardSets'],
    queryFn: fetchPetCardSets,
    enabled: !!anchorRef.current,
  });

  const petCardSetOptions = useMemo(() => {
    if (!petCardSets) {
      return [];
    }
    return Object.entries(petCardSets).map(([id, name]) => ({
      label: name as string,
      value: id,
    }));
  }, [petCardSets]);

  const petCardContent = (
    <Select
      showSearch
      placeholder="请选择装备套装"
      style={{ width: 200 }}
      value={petConfig.petCardSetId}
      onChange={(value) => updatePetConfig(petConfig.id, { petCardSetId: value })}
      options={petCardSetOptions}
      loading={!petCardSets}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );

  // --- Menu Item Definitions ---
  const baseConfigItems: MenuItemType[] = [
    {
      key: 'skill',
      icon: <ExperimentOutlined />,
      color: '#722ed1',
      popoverContent: skillContent,
      title: '技能配置',
    },
    {
      key: 'petCard',
      icon: <ToolOutlined />,
      color: '#fa8c16',
      popoverContent: petCardContent,
      title: '装备配置',
    },
  ];

  const otherConfigItems: MenuItemType[] = petConfig.otherConfigs.map((config) => {
    // 获取当前配置以外的其他可用配置名称
    const otherAvailableNames = availableConfigNames.filter((name) => name !== config.name);
    const currentConfigOptions = [
      { value: config.name, label: config.name },
      ...otherAvailableNames.map((name) => ({ value: name, label: name })),
    ];

    return {
      key: config.id,
      icon: <SettingOutlined />,
      color: '#8c8c8c',
      title: config.name,
      popoverContent: (
        <Space direction="vertical">
          <Select
            value={config.name}
            style={{ width: 120 }}
            onChange={(newName) => {
              // 检查新名称是否与其他配置冲突
              const isNameConflict = petConfig.otherConfigs.some(
                (c) => c.id !== config.id && c.name === newName
              );
              if (!isNameConflict) {
                updateOtherConfig(petConfig.id, config.id, { name: newName });
              }
            }}
            options={currentConfigOptions}
          />
          <Input
            placeholder="配置值"
            defaultValue={config.value}
            onChange={(e) => updateOtherConfig(petConfig.id, config.id, { value: e.target.value })}
          />
          <Button danger size="small" onClick={() => removeOtherConfig(petConfig.id, config.id)}>
            删除
          </Button>
        </Space>
      ),
    };
  });

  const allConfigItems: Partial<MenuItemType>[] = [...baseConfigItems, ...otherConfigItems];

  if (availableConfigNames.length > 0 && petConfig.otherConfigs.length < 4) {
    allConfigItems.push({
      key: 'add',
      icon: <PlusOutlined />,
      color: '#52c41a',
      onClick: () => {
        const state = useDamageCalculatorStore.getState();
        const currentPetConfig = state.petQueue.find((p) => p?.id === petConfig.id);
        if (currentPetConfig) {
          const existingNames = new Set(currentPetConfig.otherConfigs.map((c) => c.name));
          const nextAvailableConfig = PRESET_CONFIG_NAMES.find((name) => !existingNames.has(name));
          if (nextAvailableConfig) {
            addOtherConfig(petConfig.id, nextAvailableConfig);
          }
        }
      },
      title: '添加自定义配置',
    });
  }

  const angleStep = allConfigItems.length > 1 ? 90 / (allConfigItems.length - 1) : 0;
  const dynamicMenuItems: Partial<MenuItemType>[] = allConfigItems.map((item, index) => ({
    ...item,
    angle: 45 - index * angleStep,
  }));

  const staticItems: Partial<MenuItemType>[] = [
    {
      key: 'swap',
      icon: <SwapOutlined />,
      onClick: onSwap,
      angle: 135,
      color: '#1890ff',
      title: '替换亚比',
    },
    {
      key: 'remove',
      icon: <DeleteOutlined />,
      onClick: onRemove,
      angle: 225,
      color: '#ff7875',
      title: '移除亚比',
    },
  ];

  const menuItems: MenuItemType[] = [...staticItems, ...dynamicMenuItems].map((item) => ({
    key: item.key!,
    icon: item.icon!,
    color: item.color!,
    title: item.title!,
    angle: item.angle!,
    popoverContent: item.popoverContent,
    onClick: item.onClick,
  }));

  return (
    <motion.div
      ref={menuRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence>
        {menuItems.map((item) => {
          const avatarStyle: React.CSSProperties = {
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: `0 0 25px ${item.color}a0`,
            color: item.color,
          };

          const hasPopover = item.popoverContent && React.Children.count(item.popoverContent) > 0;

          const buttonContent = (
            <Avatar
              size="large"
              icon={item.icon}
              style={avatarStyle}
              onClick={hasPopover ? undefined : item.onClick}
            />
          );

          return (
            <motion.div
              key={item.key}
              layout
              custom={item.angle}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ position: 'absolute' }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {hasPopover ? (
                <Popover
                  content={item.popoverContent}
                  title={item.title}
                  trigger="click"
                  placement="right"
                >
                  {buttonContent}
                </Popover>
              ) : (
                buttonContent
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default RadialMenu;
