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
    // Exclude configName from params sent to updateCalculationParams
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { configName: _, ...params } = allValues;
    updateCalculationParams(params);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="配置名称" name="configName">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="威力加成" name="powerBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="伤害加成" name="damageBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="爆伤加成" name="critDamageBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="数值加成" name="numericBuff">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="穿防收益" name="penetration">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="克制关系" name="restraintFactor">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="克制倍率" name="restraintMultiplier">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="面板攻击" name="panelAttack">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="技能威力" name="skillPower">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="属性等级" name="attributeLevel">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="BOSS防御" name="bossDefense">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="技能段数" name="skillSegments">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

// --- Main Component ---

const DamageCalculator: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const store = useDamageCalculatorStore();
  const [isPetSelectionModalVisible, setIsPetSelectionModalVisible] = useState(false);
  const [isImportExportModalVisible, setIsImportExportModalVisible] = useState(false);
  const [configString, setConfigString] = useState('');
  const [swapTargetId, setSwapTargetId] = useState<string | null>(null);
  const avatarRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const activePetConfig = store.petQueue.find((p) => p?.id === store.activePetId);

  useCopilotReadable({
    description: '伤害计算器的完整状态，包括配置名称、全局参数和阵容队列。',
    value: store,
  });

  useCopilotAction({
    name: 'updateCalculationParameters',
    description: '更新全局计算参数。可以一次更新一个或多个参数。',
    parameters: [
      { name: 'powerBuff', type: 'number', description: '新的威力加成值' },
      { name: 'damageBuff', type: 'number', description: '新的伤害加成值' },
      { name: 'critDamageBuff', type: 'number', description: '新的爆伤加成值' },
      { name: 'numericBuff', type: 'number', description: '新的数值加成值' },
      { name: 'panelAttack', type: 'number', description: '新的面板攻击值' },
      { name: 'skillPower', type: 'number', description: '新的技能威力值' },
      { name: 'attributeLevel', type: 'number', description: '新的属性等级值' },
      { name: 'penetration', type: 'number', description: '新的穿防收益值' },
      { name: 'restraintFactor', type: 'number', description: '新的克制关系值' },
      { name: 'restraintMultiplier', type: 'number', description: '新的克制倍率值' },
      { name: 'bossDefense', type: 'number', description: '新的BOSS防御值' },
      { name: 'skillSegments', type: 'number', description: '新的技能段数值' },
    ],
    handler: async (args) => {
      store.updateCalculationParams(args);
    },
  });

  useCopilotAction({
    name: 'setConfigurationName',
    description: '设置当前计算配置的名称。',
    parameters: [{ name: 'name', type: 'string', description: '新的配置名称', required: true }],
    handler: async ({ name }) => {
      store.setConfigName(name);
    },
  });

  useCopilotAction({
    name: 'clearQueue',
    description: '清空整个阵容队列。',
    parameters: [],
    handler: async () => {
      store.clearQueue();
    },
  });

  useCopilotAction({
    name: 'removePetFromQueueByIndex',
    description: '根据阵容中的位置（索引）移除一个亚比。',
    parameters: [
      {
        name: 'index',
        type: 'number',
        description: '要移除的亚比在阵容中的位置，从1开始',
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
    description: '通过亚比名称向阵容队列中添加一个新亚比。',
    parameters: [
      { name: 'petName', type: 'string', description: '要添加的亚比的确切名称', required: true },
    ],
    handler: async ({ petName }) => {
      try {
        const petList = await fetchPetList();
        const foundPet = petList.find((p) => p.name === petName);
        if (foundPet) {
          store.addPetToQueue(foundPet.id.toString());
          messageApi.success(`已将 ${petName} 添加到阵容中。`);
        } else {
          messageApi.error(`未找到名为 "${petName}" 的亚比。`);
        }
      } catch (error) {
        console.error('获取亚比列表时出错:', error);
        messageApi.error('获取亚比列表失败。');
      }
    },
  });

  useCopilotAction({
    name: 'updatePetConfiguration',
    description: '更新阵容中指定位置的亚比的配置，例如技能ID。',
    parameters: [
      {
        name: 'index',
        type: 'number',
        description: '要更新的亚比在阵容中的位置，从1开始',
        required: true,
      },
      { name: 'skillId', type: 'string', description: '新的技能ID' },
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
            messageApi.success(`已更新阵容中第 ${index} 个亚比的信息。`);
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

    // 自动获取并设置默认技能
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
      messageApi.success('导出代码已生成！');
    } catch (error) {
      messageApi.error('生成导出代码失败！');
      console.error(error);
    }
  };

  const handleImport = () => {
    if (!configString) {
      messageApi.error('导入代码不能为空！');
      return;
    }
    try {
      const binaryString = atob(configString);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decompressed = pako.inflate(bytes, { to: 'string' });
      store.importState(decompressed);
      setIsImportExportModalVisible(false);
      messageApi.success('配置导入成功！');
    } catch (error) {
      messageApi.error('导入失败，代码无效或已损坏！');
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(configString).then(
      () => {
        messageApi.success('已复制到剪贴板！');
      },
      () => {
        messageApi.error('复制失败！');
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
      messageApi.warning('面板攻击和技能威力不能为空！');
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
    messageApi.success('计算完成！');
  };

  return (
    <Layout>
      <Title level={1}>伤害计算器</Title>
      <Paragraph>在此配置全局增益、亚比阵容，并计算最终伤害。</Paragraph>

      <Card
        title="全局计算参数"
        extra={<Button onClick={() => setIsImportExportModalVisible(true)}>导入/导出</Button>}
      >
        <CalculationParamsForm />
      </Card>

      <Card title="阵容队列" style={{ marginTop: 24 }}>
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
        title="计算结果"
        style={{ marginTop: 24 }}
        extra={<Button onClick={handleCalculate}>计算伤害</Button>}
      >
        <Title level={3}>
          阵容总伤害: <Text type="success">{store.totalDamage.toLocaleString()}</Text>
        </Title>
        {activePetConfig && (
          <Paragraph>
            当前选中亚比伤害:{' '}
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
        title="导入/导出配置"
        open={isImportExportModalVisible}
        onCancel={() => setIsImportExportModalVisible(false)}
        footer={[
          <Button key="export" onClick={handleExport}>
            生成导出代码
          </Button>,
          <Button key="copy" onClick={handleCopy} disabled={!configString}>
            复制
          </Button>,
          <Button key="import" onClick={handleImport}>
            从代码导入
          </Button>,
        ]}
      >
        <TextArea
          rows={6}
          value={configString}
          onChange={(e) => setConfigString(e.target.value)}
          placeholder="在此处粘贴配置代码以导入，或点击“生成导出代码”"
        />
      </Modal>
    </Layout>
  );
};

export default DamageCalculator;
