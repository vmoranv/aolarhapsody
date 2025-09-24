import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useDamageCalculatorStore } from '../store/damageCalculator';
import type { PetConfig } from '../types/damageCalculator';
import {
  fetchPetCardSets,
  fetchPetRawDataById,
  fetchSkillById,
  splitToArray,
} from '../utils/pet-helper';
import ConfigList from './ConfigList';

/**
 * @description 预设的自定义配置名称
 * 这些是游戏中常见的装备/属性类型，用于快速选择配置项
 */
const PRESET_CONFIG_NAMES = ['星灵', '晶钥', '神兵', '魂卡', '铭文', '装备', '特性晶石', '魂器'];

/**
 * @description RadialMenu 组件的属性接口定义
 *
 * 该组件用于为伤害计算器中的单个亚比提供配置菜单
 * 菜单以径向方式展开，围绕锚点元素显示
 *
 * @interface RadialMenuProps
 * @property {PetConfig} petConfig - 当前亚比的配置对象
 * @property {React.RefObject<HTMLDivElement | null>} anchorRef - 菜单锚点的引用（通常是亚比头像）
 * @property {() => void} onClose - 关闭菜单的回调函数
 * @property {() => void} onSwap - 替换亚比的回调函数
 * @property {() => void} onRemove - 移除亚比的回调函数
 */
interface RadialMenuProps {
  petConfig: PetConfig;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSwap: () => void;
  onRemove: () => void;
}

/**
 * @description 菜单项的数据结构接口定义
 *
 * 每个菜单项代表一个可配置的功能或操作
 *
 * @interface MenuItemType
 * @property {string} key - 唯一标识符，用于React列表渲染
 * @property {React.ReactElement} icon - 显示的图标元素
 * @property {string} color - 图标颜色，用于视觉区分
 * @property {string} title - 菜单项标题，用于显示和提示
 * @property {number} [angle] - 在径向菜单中的角度位置（度）
 * @property {React.ReactElement} [popoverContent] - 弹出内容，用于复杂配置
 * @property {() => void} [onClick] - 点击事件处理函数
 */
interface MenuItemType {
  key: string;
  icon: React.ReactElement;
  color: string;
  title: string;
  angle?: number;
  popoverContent?: React.ReactElement;
  onClick?: () => void;
}

/**
 * @description 菜单容器的 Framer Motion 动画变体定义
 *
 * 控制整个菜单的显示/隐藏动画效果
 * 包括透明度变化和子元素的交错动画
 */
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

/**
 * @description 菜单项的 Framer Motion 动画变体定义
 *
 * 控制单个菜单项的动画效果
 * 包括位置、缩放、旋转等变化
 *
 * @param {number} angle - 菜单项在径向菜单中的角度位置
 */
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

/**
 * @description 径向菜单组件，用于配置单个亚比
 *
 * 该组件提供围绕锚点元素展开的径向菜单界面
 * 用户可以通过该菜单配置亚比的各种属性和技能
 *
 * 主要功能包括：
 * 1. 技能配置管理
 * 2. 装备配置管理
 * 3. 自定义属性配置
 * 4. 亚比替换和移除操作
 *
 * @param {RadialMenuProps} props - 组件属性
 * @returns {JSX.Element} 径向菜单组件
 */
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

  /**
   * 处理菜单定位和点击外部关闭逻辑
   *
   * 该副作用负责：
   * 1. 根据锚点元素位置更新菜单位置
   * 2. 监听窗口滚动和大小变化以重新定位
   * 3. 处理点击菜单外部区域关闭菜单的逻辑
   */
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

  // --- 数据获取：技能选择相关 ---

  /**
   * 获取亚比原始数据，用于提取技能列表
   *
   * 通过raceId获取亚比的详细数据，包括新旧技能信息
   */
  const { data: petRawData } = useQuery({
    queryKey: ['petRawData', petConfig.raceId],
    queryFn: () => fetchPetRawDataById(petConfig.raceId),
    enabled: !!petConfig.raceId,
  });

  /**
   * 从亚比原始数据中提取技能ID列表
   *
   * 包括新技能和旧技能两个部分
   * 格式化为可用于获取技能详情的ID数组
   */
  const skillIds = useMemo(() => {
    if (!petRawData) {
      return [];
    }
    const newSkills = splitToArray(petRawData[87] as string);
    const oldSkills = splitToArray(petRawData[29] as string);
    const allSkillStrings = [...newSkills, ...oldSkills];
    return allSkillStrings.map((s) => s.split('-').pop()!).filter(Boolean);
  }, [petRawData]);

  /**
   * 获取技能详细信息
   *
   * 根据技能ID列表批量获取技能的详细信息
   * 用于技能选择下拉框的显示
   */
  const { data: skillsData } = useQuery({
    queryKey: ['skillsDetails', skillIds],
    queryFn: () => Promise.all(skillIds.map((id) => fetchSkillById(Number(id)))),
    enabled: skillIds.length > 0,
  });

  /**
   * 构建技能选择选项列表
   *
   * 将技能详细信息转换为Select组件可用的选项格式
   * 优先使用中文名称，备选英文名称
   */
  const skillOptions = useMemo(() => {
    if (!skillsData) {
      return [];
    }
    return skillsData.map((skill) => ({
      label: skill.cnName || skill.enName,
      value: skill.id.toString(),
    }));
  }, [skillsData]);

  /**
   * 计算可用的配置名称列表
   *
   * 从预设名称中排除已经使用的名称
   * 用于添加新配置时的选择
   */
  const availableConfigNames = useMemo(() => {
    const existingNames = new Set(petConfig.otherConfigs.map((c) => c.name));
    return PRESET_CONFIG_NAMES.filter((name) => !existingNames.has(name));
  }, [petConfig.otherConfigs]);

  // --- 弹出内容定义 ---

  /**
   * 技能配置弹出内容
   *
   * 提供技能列表管理和选择功能
   * 用户可以添加、删除和修改技能配置
   */
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

  /**
   * 获取装备套装数据
   *
   * 用于装备配置的下拉选择
   */
  const { data: petCardSets } = useQuery({
    queryKey: ['petCardSets'],
    queryFn: fetchPetCardSets,
    enabled: !!anchorRef.current,
  });

  /**
   * 构建装备套装选项列表
   *
   * 将装备套装数据转换为Select组件可用的选项格式
   */
  const petCardSetOptions = useMemo(() => {
    if (!petCardSets) {
      return [];
    }
    return Object.entries(petCardSets).map(([id, name]) => ({
      label: name as string,
      value: id,
    }));
  }, [petCardSets]);

  /**
   * 装备配置弹出内容
   *
   * 提供装备套装选择功能
   */
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

  // --- 菜单项定义 ---

  /**
   * 基础配置项定义
   *
   * 包括技能配置和装备配置两个固定项
   */
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

  /**
   * 其他配置项定义
   *
   * 根据当前亚比的配置动态生成
   * 每个配置项都可以修改名称和值
   */
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

  /**
   * 所有配置项合并
   *
   * 将基础配置项和其他配置项合并
   * 如果还有可用名称且配置数量未达上限，则添加"添加"项
   */
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

  /**
   * 计算动态菜单项的角度位置
   *
   * 将配置项均匀分布在右上区域（45°到-45°）
   */
  const angleStep = allConfigItems.length > 1 ? 90 / (allConfigItems.length - 1) : 0;
  const dynamicMenuItems: Partial<MenuItemType>[] = allConfigItems.map((item, index) => ({
    ...item,
    angle: 45 - index * angleStep,
  }));

  /**
   * 静态菜单项定义
   *
   * 包括替换亚比和移除亚比两个固定操作项
   * 分别位于左下和右下位置
   */
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

  /**
   * 合并所有菜单项
   *
   * 将静态项和动态项合并为完整的菜单项列表
   */
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
