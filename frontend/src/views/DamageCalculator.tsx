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
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

// --- Type Declarations ---
declare const pako: any; // Declare pako for CDN usage
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// --- Sub-Components ---

// 1. Global Calculation Parameters Form
const CalculationParamsForm: React.FC = () => {
  const { t } = useTranslation('damageCalculator');
  const { configName, setConfigName, calculationParams, updateCalculationParams } =
    useDamageCalculatorStore();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...calculationParams, configName });
  }, [calculationParams, configName, form]);

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
        <Col span={24}>
          <Form.Item label={t('configName')} name="configName">
            <Input placeholder={t('configNamePlaceholder')} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('powerBuff')} name="powerBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('damageBuff')} name="damageBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('critDamageBuff')} name="critDamageBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('numericBuff')} name="numericBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('penetration')} name="penetration">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('restraintFactor')} name="restraintFactor">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('restraintMultiplier')} name="restraintMultiplier">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('panelAttack')} name="panelAttack">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('skillPower')} name="skillPower">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('attributeLevel')} name="attributeLevel">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('bossDefense')} name="bossDefense">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label={t('skillSegments')} name="skillSegments">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

// --- Main Component ---

const DamageCalculator: React.FC = () => {
  const { t } = useTranslation(['damageCalculator', 'common']);
  const { message: messageApi } = App.useApp();
  const store = useDamageCalculatorStore();
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
      { name: 'skillId', type: 'string', description: t('copilot.updatePetSkillIdParam') },
    ],
    handler: async ({ index, skillId }) => {
      if (index > 0 && index <= store.petQueue.length) {
        const petToUpdate = store.petQueue[index - 1];
        if (petToUpdate) {
          const updates: { skillId?: string } = {};
          if (skillId) {
            updates.skillId = skillId;
          }

          if (Object.keys(updates).length > 0) {
            store.updatePetConfig(petToUpdate.id, updates);
            messageApi.success(t('alerts.updatePetSuccess', { index }));
          }
        }
      }
    },
  });

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
            const firstSkill = skills[0];
            const skillId = firstSkill.split('-').pop();
            if (skillId) {
              store.updatePetConfig(finalPetId, { skillId });
            }
          }
        }
      });
    }
  };

  const handleSwapClick = () => {
    if (activePetConfig) {
      setSwapTargetId(activePetConfig.id);
      setIsPetSelectionModalVisible(true);
    }
  };

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
