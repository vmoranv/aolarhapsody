import {
  CloseOutlined,
  ExperimentOutlined,
  PlusOutlined,
  SettingOutlined,
  SwapOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Button, Input, Popover, Select, Space } from 'antd';
import { motion, Variants } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDamageCalculatorStore } from '../store/damageCalculator';
import type { PetConfig } from '../types/damageCalculator';
import { fetchPetRawDataById, fetchSkillById, splitToArray } from '../utils/pet-helper';
import ConfigList from './ConfigList';

const PRESET_CONFIG_NAMES = ['星灵', '晶钥', '神兵', '魂卡', '铭文', '装备', '特性晶石', '魂器'];

interface RadialMenuProps {
  petConfig: PetConfig;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSwap: () => void;
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

const RadialMenu: React.FC<RadialMenuProps> = ({ petConfig, anchorRef, onClose, onSwap }) => {
  const {
    updatePetConfig,
    addPetCard,
    removePetCard,
    updatePetCard,
    addOtherConfig,
    removeOtherConfig,
    updateOtherConfig,
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

  if (!anchorRef.current) {
    return null;
  }

  // --- Popover Contents ---
  const skillContent = (
    <Select
      showSearch
      placeholder="请选择技能"
      style={{ width: 200 }}
      value={petConfig.skillId}
      onChange={(value) => updatePetConfig(petConfig.id, { skillId: value })}
      options={skillOptions}
      loading={!skillsData}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  );

  const petCardContent = (
    <div style={{ width: 280 }}>
      <ConfigList
        title="装备配置"
        items={petConfig.petCards}
        onAddItem={() => addPetCard(petConfig.id)}
        onRemoveItem={(cardId) => removePetCard(petConfig.id, cardId)}
        onUpdateItem={(cardId, value) => updatePetCard(petConfig.id, cardId, value)}
        placeholder="请输入装备ID"
      />
    </div>
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
    const currentConfigOptions = [
      { value: config.name, label: config.name },
      ...availableConfigNames.map((name) => ({ value: name, label: name })),
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
            onChange={(newName) => updateOtherConfig(petConfig.id, config.id, { name: newName })}
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

  if (availableConfigNames.length > 0 && petConfig.otherConfigs.length < 8) {
    allConfigItems.push({
      key: 'add',
      icon: <PlusOutlined />,
      color: '#52c41a',
      onClick: () => {
        if (availableConfigNames.length > 0) {
          addOtherConfig(petConfig.id, availableConfigNames[0]);
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
      key: 'close',
      icon: <CloseOutlined />,
      onClick: onClose,
      angle: 225,
      color: '#ff4d4f',
      title: '关闭',
    },
    {
      key: 'swap',
      icon: <SwapOutlined />,
      onClick: onSwap,
      angle: 135,
      color: '#1890ff',
      title: '替换亚比',
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
            custom={item.angle}
            variants={itemVariants}
            style={{ position: 'absolute' }}
            whileHover={{ scale: 1.15 }}
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
    </motion.div>
  );
};

export default RadialMenu;
