import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Overlay from '../components/Overlay';
import PetSelectionModal from '../components/PetSelectionModal';
import RadialMenu from '../components/RadialMenu';
import { useDamageCalculatorStore } from '../store/damageCalculator';
import {
  fetchPetList,
  fetchPetRawDataById,
  getPetImageUrl,
  splitToArray,
} from '../utils/pet-helper';

// --- 类型声明 ---
declare const pako: any; // 通过CDN引入的pako库声明

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// --- 子组件 ---

/**
 * 全局计算参数表单组件
 *
 * 该组件用于设置影响所有亚比伤害计算的全局参数
 * 包括攻击力加成、伤害加成、暴击伤害加成等
 *
 * 参数通过Ant Design表单管理，并与Zustand状态存储同步
 */
const CalculationParamsForm: React.FC = () => {
  const { t } = useTranslation('damageCalculator');
  const { configName, setConfigName, calculationParams, updateCalculationParams } =
    useDamageCalculatorStore();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...calculationParams, configName });
  }, [calculationParams, configName, form]);

  /**
   * @description 处理表单值变化，更新 Zustand store
   * @param {any} changedValues - 变化的值
   * @param {any} allValues - 所有的值
   */
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if ('configName' in changedValues) {
      setConfigName(changedValues.configName);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { configName: _, ...params } = allValues;
    updateCalculationParams(params);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
      <Row gutter={16}>
        {/* 配置名称 - 用于标识当前配置方案 */}
        <Col span={24}>
          <Form.Item label={t('configName')} name="configName">
            <Input placeholder={t('configNamePlaceholder')} />
          </Form.Item>
        </Col>
        {/* 攻击力加成 - 影响面板攻击的百分比加成 */}
        <Col span={4}>
          <Form.Item label={t('powerBuff')} name="powerBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 伤害加成 - 对最终伤害的百分比加成 */}
        <Col span={4}>
          <Form.Item label={t('damageBuff')} name="damageBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 暴击伤害加成 - 暴击时额外伤害加成 */}
        <Col span={4}>
          <Form.Item label={t('critDamageBuff')} name="critDamageBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 数值增益 - 直接增加伤害数值的加成 */}
        <Col span={4}>
          <Form.Item label={t('numericBuff')} name="numericBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 穿透 - 减少目标防御效果 */}
        <Col span={4}>
          <Form.Item label={t('penetration')} name="penetration">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 抑制系数 - 属性相克时的基础倍率 */}
        <Col span={4}>
          <Form.Item label={t('restraintFactor')} name="restraintFactor">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 抑制倍率 - 属性相克时的额外倍率 */}
        <Col span={4}>
          <Form.Item label={t('restraintMultiplier')} name="restraintMultiplier">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 面板攻击 - 角色基础攻击力 */}
        <Col span={4}>
          <Form.Item label={t('panelAttack')} name="panelAttack">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 技能威力 - 技能的基础伤害系数 */}
        <Col span={4}>
          <Form.Item label={t('skillPower')} name="skillPower">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 属性等级 - 影响属性克制效果的等级 */}
        <Col span={4}>
          <Form.Item label={t('attributeLevel')} name="attributeLevel">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* BOSS防御 - 目标BOSS的防御力值 */}
        <Col span={4}>
          <Form.Item label={t('bossDefense')} name="bossDefense">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 技能段数 - 技能攻击的次数或段数 */}
        <Col span={4}>
          <Form.Item label={t('skillSegments')} name="skillSegments">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

// --- 主组件 ---

/**
 * 伤害计算器主页面组件
 *
 * 该组件提供完整的伤害计算功能，包括：
 * 1. 全局计算参数设置
 * 2. 亚比队列管理
 * 3. 单个亚比详细配置（通过径向菜单）
 * 4. 配置导入导出
 * 5. 伤害计算执行
 * 6. AI辅助操作支持
 *
 * 页面结构：
 * - 标题和描述
 * - 全局参数设置区域
 * - 亚比队列显示区域
 * - 计算结果展示区域
 * - 导入导出模态框
 */
const DamageCalculator: React.FC = () => {
  const { t } = useTranslation(['damageCalculator', 'common']);
  const { message: messageApi } = App.useApp();
  const store = useDamageCalculatorStore();

  /**
   * 组件状态管理
   */
  const [isPetSelectionModalVisible, setIsPetSelectionModalVisible] = useState(false);
  const [isImportExportModalVisible, setIsImportExportModalVisible] = useState(false);
  const [configString, setConfigString] = useState('');
  const [swapTargetId, setSwapTargetId] = useState<string | null>(null);
  const avatarRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const activePetConfig = store.petQueue.find((p) => p?.id === store.activePetId);

  useCopilotReadable({
    description: t('copilot.storeDescription'),
    value: store,
  });

  useCopilotAction({
    name: 'updateCalculationParameters',
    description: t('copilot.updateParamsAction'),
    parameters: [
      { name: 'powerBuff', type: 'number', description: t('copilot.updateParams.powerBuff') },
      { name: 'damageBuff', type: 'number', description: t('copilot.updateParams.damageBuff') },
      {
        name: 'critDamageBuff',
        type: 'number',
        description: t('copilot.updateParams.critDamageBuff'),
      },
      { name: 'numericBuff', type: 'number', description: t('copilot.updateParams.numericBuff') },
      { name: 'panelAttack', type: 'number', description: t('copilot.updateParams.panelAttack') },
      { name: 'skillPower', type: 'number', description: t('copilot.updateParams.skillPower') },
      {
        name: 'attributeLevel',
        type: 'number',
        description: t('copilot.updateParams.attributeLevel'),
      },
      { name: 'penetration', type: 'number', description: t('copilot.updateParams.penetration') },
      {
        name: 'restraintFactor',
        type: 'number',
        description: t('copilot.updateParams.restraintFactor'),
      },
      {
        name: 'restraintMultiplier',
        type: 'number',
        description: t('copilot.updateParams.restraintMultiplier'),
      },
      { name: 'bossDefense', type: 'number', description: t('copilot.updateParams.bossDefense') },
      {
        name: 'skillSegments',
        type: 'number',
        description: t('copilot.updateParams.skillSegments'),
      },
    ],
    handler: async (args) => {
      store.updateCalculationParams(args);
    },
  });

  useCopilotAction({
    name: 'setConfigurationName',
    description: t('copilot.setConfigNameAction'),
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: t('copilot.setConfigNameParam'),
        required: true,
      },
    ],
    handler: async ({ name }) => {
      store.setConfigName(name);
    },
  });

  useCopilotAction({
    name: 'clearQueue',
    description: t('copilot.clearQueueAction'),
    parameters: [],
    handler: async () => {
      store.clearQueue();
    },
  });

  useCopilotAction({
    name: 'removePetFromQueueByIndex',
    description: t('copilot.removePetAction'),
    parameters: [
      {
        name: 'index',
        type: 'number',
        description: t('copilot.removePetParam'),
        required: true,
      },
    ],
    handler: async ({ index }) => {
      if (index > 0 && index <= store.petQueue.length) {
        const petToRemove = store.petQueue[index - 1];
        if (petToRemove) {
          store.removePetFromQueue(petToRemove.id);
        }
      }
    },
  });

  useCopilotAction({
    name: 'addPetToQueueByName',
    description: t('copilot.addPetAction'),
    parameters: [
      { name: 'petName', type: 'string', description: t('copilot.addPetParam'), required: true },
    ],
    handler: async ({ petName }) => {
      try {
        const petList = await fetchPetList();
        const foundPet = petList.find((p) => p.name === petName);
        if (foundPet) {
          store.addPetToQueue(foundPet.id.toString());
          messageApi.success(t('alerts.addPetSuccess', { petName }));
        } else {
          messageApi.error(t('alerts.addPetNotFound', { petName }));
        }
      } catch (error) {
        console.error('获取亚比列表时出错:', error);
        messageApi.error(t('alerts.addPetListError'));
      }
    },
  });

  useCopilotAction({
    name: 'updatePetConfiguration',
    description: t('copilot.updatePetAction'),
    parameters: [
      {
        name: 'index',
        type: 'number',
        description: t('copilot.updatePetIndexParam'),
        required: true,
      },
      { name: 'skills', type: 'string[]', description: t('copilot.updatePetSkillIdParam') },
    ],
    handler: async ({ index, skills }) => {
      if (index > 0 && index <= store.petQueue.length) {
        const petToUpdate = store.petQueue[index - 1];
        if (petToUpdate) {
          const updates: { skills?: { id: string; skillId: string }[] } = {};
          if (skills) {
            updates.skills = skills.map((skillId) => ({ id: `skill-${Date.now()}`, skillId }));
          }

          if (Object.keys(updates).length > 0) {
            store.updatePetConfig(petToUpdate.id, updates);
            messageApi.success(t('alerts.updatePetSuccess', { index }));
          }
        }
      }
    },
  });

  /**
   * 处理亚比选择事件
   *
   * 当用户从亚比选择模态框中选择一个亚比时调用
   * 根据当前状态决定是添加新亚比还是替换现有亚比
   * 同时自动获取该亚比的技能信息
   *
   * @param {string} raceId - 选中亚比的raceId
   */
  const handlePetSelect = (raceId: string) => {
    let petIdForSkillFetch: string | null = null;
    const raceIdForSkillFetch: string = raceId;

    if (swapTargetId) {
      petIdForSkillFetch = swapTargetId;
      store.replacePetInQueue(swapTargetId, raceId);
      setSwapTargetId(null);
    } else {
      const newPet = store.addPetToQueue(raceId);
      if (newPet) {
        petIdForSkillFetch = newPet.id;
      }
    }
    setIsPetSelectionModalVisible(false);

    if (petIdForSkillFetch) {
      const finalPetId = petIdForSkillFetch;
      fetchPetRawDataById(raceIdForSkillFetch).then((petRawData) => {
        if (petRawData && petRawData[87]) {
          const skills = splitToArray(petRawData[87] as string);
          if (skills.length > 0) {
            const skillIds = skills.map((skill) => skill.split('-').pop()!).filter(Boolean);
            if (skillIds.length > 0) {
              store.updatePetConfig(finalPetId, {
                skills: skillIds.map((skillId) => ({ id: `skill-${Date.now()}`, skillId })),
              });
            }
          }
        }
      });
    }
  };

  /**
   * 处理径向菜单中的替换按钮点击事件
   *
   * 设置替换目标并打开亚比选择模态框
   */
  const handleSwapClick = () => {
    if (activePetConfig) {
      setSwapTargetId(activePetConfig.id);
      setIsPetSelectionModalVisible(true);
    }
  };

  /**
   * 处理径向菜单中的移除按钮点击事件
   *
   * 从队列中移除当前激活的亚比并关闭菜单
   */
  const handleRemoveClick = () => {
    if (activePetConfig) {
      store.removePetFromQueue(activePetConfig.id);
      store.setActivePetId(null);
    }
  };

  /**
   * 导出当前配置
   *
   * 将当前配置压缩为Base64字符串，便于分享和保存
   */
  const handleExport = () => {
    try {
      const { configName, calculationParams, petQueue } = store;
      const config = { configName, calculationParams, petQueue };
      const jsonString = JSON.stringify(config);
      const compressed = pako.deflate(jsonString);
      const base64 = btoa(String.fromCharCode.apply(null, compressed));
      setConfigString(base64);
      messageApi.success(t('alerts.exportSuccess'));
    } catch (error) {
      messageApi.error(t('alerts.exportError'));
      console.error(error);
    }
  };

  /**
   * 导入配置
   *
   * 从Base64字符串导入配置并更新状态
   */
  const handleImport = () => {
    if (!configString) {
      messageApi.error(t('alerts.importEmpty'));
      return;
    }
    try {
      const binaryString = atob(configString);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decompressed = pako.inflate(bytes, { to: 'string' });
      const parsed = JSON.parse(decompressed);

      // Basic validation before setting state
      if (parsed.calculationParams && Array.isArray(parsed.petQueue)) {
        store.importState(decompressed);
        setIsImportExportModalVisible(false);
        messageApi.success(t('alerts.importSuccess'));
      } else {
        messageApi.error(t('alerts.importErrorInvalidJSON'));
      }
    } catch (error) {
      messageApi.error(t('alerts.importErrorParseFailed'));
      console.error('Import failed:', error);
    }
  };

  /**
   * 复制配置字符串到剪贴板
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(configString).then(
      () => {
        messageApi.success(t('alerts.copySuccess'));
      },
      () => {
        messageApi.error(t('alerts.copyError'));
      }
    );
  };

  /**
   * 执行伤害计算
   *
   * 根据全局参数和亚比配置计算总伤害
   * 结果存储在状态中并显示给用户
   */
  const handleCalculate = () => {
    const {
      powerBuff = 0,
      damageBuff = 0,
      critDamageBuff = 0,
      numericBuff = 0,
      panelAttack = 0,
      skillPower = 0,
      attributeLevel = 100,
      penetration = 0,
      restraintFactor = 1,
      restraintMultiplier = 1,
      bossDefense = 0,
      skillSegments = 1,
    } = store.calculationParams;

    if (!panelAttack || !skillPower) {
      messageApi.warning(t('alerts.calculationWarning'));
      store.setTotalDamage(0);
      store.petQueue.forEach((p) => {
        if (p && p.finalDamage !== 0) {
          store.updatePetConfig(p.id, { finalDamage: 0 });
        }
      });
      return;
    }

    const safeBossDefense = bossDefense === 0 ? 1 : bossDefense;

    const singleHitDamage =
      (powerBuff *
        damageBuff *
        critDamageBuff *
        numericBuff *
        panelAttack *
        skillPower *
        attributeLevel *
        penetration *
        restraintFactor *
        restraintMultiplier) /
      safeBossDefense;

    const totalDamageResult = singleHitDamage * skillSegments;
    const finalDamage = totalDamageResult > 0 ? Math.floor(totalDamageResult) : 0;

    if (store.petQueue.every((p) => p === null)) {
      store.setTotalDamage(finalDamage);
    } else {
      let currentTotalDamage = 0;
      store.petQueue.forEach((pet) => {
        if (pet) {
          store.updatePetConfig(pet.id, { finalDamage });
          currentTotalDamage += finalDamage;
        }
      });
      store.setTotalDamage(currentTotalDamage);
    }
    messageApi.success(t('alerts.calculationSuccess'));
  };

  return (
    <Layout>
      <Title level={1}>{t('title')}</Title>
      <Paragraph>{t('description')}</Paragraph>

      <Card
        title={t('globalParams')}
        extra={
          <Button onClick={() => setIsImportExportModalVisible(true)}>{t('importExport')}</Button>
        }
      >
        <CalculationParamsForm />
      </Card>

      <Card title={t('queue')} style={{ marginTop: 24 }}>
        <Space size="large">
          {store.petQueue.map((pet) => (
            <div
              key={pet?.id || Math.random()}
              ref={(el) => {
                if (pet?.id) {
                  avatarRefs.current.set(pet.id, el);
                }
              }}
              style={{ textAlign: 'center', position: 'relative' }}
            >
              {pet ? (
                <>
                  <div onClick={() => store.setActivePetId(pet.id)} style={{ cursor: 'pointer' }}>
                    <Avatar
                      size={64}
                      src={pet.raceId ? getPetImageUrl(pet.raceId, 'avatar') : undefined}
                      icon={<UserOutlined />}
                      style={{
                        border: store.activePetId === pet.id ? '2px solid #1890ff' : 'none',
                      }}
                    />
                  </div>
                </>
              ) : (
                <Avatar
                  size={64}
                  icon={<PlusOutlined />}
                  onClick={() => setIsPetSelectionModalVisible(true)}
                  style={{ cursor: 'pointer', border: '2px dashed #d9d9d9' }}
                />
              )}
            </div>
          ))}
        </Space>
      </Card>

      <AnimatePresence>
        {activePetConfig && (
          <>
            <Overlay
              anchorRef={{ current: avatarRefs.current.get(activePetConfig.id) || null }}
              onClick={() => store.setActivePetId(null)}
            />
            <RadialMenu
              petConfig={activePetConfig}
              anchorRef={{ current: avatarRefs.current.get(activePetConfig.id) || null }}
              onClose={() => store.setActivePetId(null)}
              onSwap={handleSwapClick}
              onRemove={handleRemoveClick}
            />
          </>
        )}
      </AnimatePresence>

      <Card
        title={t('results')}
        style={{ marginTop: 24 }}
        extra={<Button onClick={handleCalculate}>{t('calculate')}</Button>}
      >
        <Title level={3}>
          {t('totalDamage')} <Text type="success">{store.totalDamage.toLocaleString()}</Text>
        </Title>
        {activePetConfig && (
          <Paragraph>
            {t('currentPetDamage')}{' '}
            <Text type="warning">{activePetConfig.finalDamage?.toLocaleString() ?? 0}</Text>
          </Paragraph>
        )}
      </Card>

      <PetSelectionModal
        visible={isPetSelectionModalVisible}
        onClose={() => setIsPetSelectionModalVisible(false)}
        onSelect={handlePetSelect}
      />

      <Modal
        title={t('importExportConfig')}
        open={isImportExportModalVisible}
        onCancel={() => setIsImportExportModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsImportExportModalVisible(false)}>
            {t('common:close')}
          </Button>,
          <Button key="import" type="primary" onClick={handleImport}>
            {t('common:import')}
          </Button>,
          <Button key="export" onClick={handleExport}>
            {t('common:export')}
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>{t('configCode')}</Text>
          <TextArea
            rows={4}
            value={configString}
            onChange={(e) => setConfigString(e.target.value)}
            placeholder={t('configPlaceholder')}
          />
          <Button onClick={handleCopy} style={{ alignSelf: 'flex-end' }}>
            {t('common:copy')}
          </Button>
        </Space>
      </Modal>
    </Layout>
  );
};

export default DamageCalculator;
