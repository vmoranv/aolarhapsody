import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, App, Button, Card, Col, Form, InputNumber, Row, Spin, Typography } from 'antd';
import { Calculator } from 'lucide-react';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;

/**
 * @file ExpCalculator.tsx
 * @description
 * 经验计算器页面组件，用于计算宠物从当前等级和经验升级到目标等级所需的经验值。
 * 该组件包含输入表单和结果展示区域，通过调用后端API进行经验计算。
 */

/**
 * @description 经验计算结果接口
 * 定义了经验计算器API返回的数据结构
 * @property {number} requiredExp - 所需经验
 */
interface ExpCalculationResult {
  requiredExp: number;
}

/**
 * @description 经验计算器主组件
 * 负责渲染经验计算器的用户界面，处理用户输入，调用后端API并展示计算结果
 * @returns {React.ReactElement} - 渲染的组件
 */
const ExpCalculator: React.FC = () => {
  // 国际化翻译函数
  const { t } = useTranslation(['miscellaneous', 'expCalculator']);
  // 加载状态，用于显示加载指示器
  const [loading, setLoading] = useState(false);
  // 计算结果状态
  const [result, setResult] = useState<ExpCalculationResult | null>(null);
  // 错误信息状态
  const [error, setError] = useState<string | null>(null);
  // Ant Design表单实例
  const [form] = Form.useForm();

  /**
   * 处理经验计算请求
   * @param values - 表单输入值，包含宠物ID、当前等级、当前经验和目标等级
   */
  const handleCalculate = async (values: {
    petId: string;
    currentLevel: number;
    currentExp: number;
    targetLevel: number;
  }) => {
    // 设置加载状态并重置之前的结果和错误
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // 构造API基础URL
      const baseUrl = import.meta.env.VITE_API_URL || '';
      // 发起POST请求到经验计算API
      const response = await fetch(`${baseUrl}/api/exp/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 将表单数据序列化为JSON发送
        body: JSON.stringify(values),
      });

      // 解析API响应
      const data = await response.json();

      // 检查响应是否成功并包含数据
      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.error || t('expCalculator:calculation_failed'));
      }
    } catch (err) {
      // 处理网络错误或其他异常
      setError(t('expCalculator:calculation_failed') + ': ' + (err as Error).message);
    } finally {
      // 重置加载状态
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Title level={2}>{t('expCalculator:title')}</Title>
      <Paragraph>{t('expCalculator:description')}</Paragraph>
      <Row gutter={16}>
        <Col span={24}>
          <Card title={t('expCalculator:input')}>
            <Form form={form} layout="vertical" onFinish={handleCalculate}>
              <Form.Item
                name="petId"
                label={t('expCalculator:petId')}
                rules={[{ required: true, message: t('expCalculator:petId_required') }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder={t('expCalculator:petId_placeholder')}
                />
              </Form.Item>
              <Form.Item
                name="currentLevel"
                label={t('expCalculator:currentLevel')}
                rules={[{ required: true, message: t('expCalculator:currentLevel_required') }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                  placeholder={t('expCalculator:currentLevel_placeholder')}
                />
              </Form.Item>
              <Form.Item
                name="currentExp"
                label={t('expCalculator:currentExp')}
                rules={[{ required: true, message: t('expCalculator:currentExp_required') }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder={t('expCalculator:currentExp_placeholder')}
                />
              </Form.Item>
              <Form.Item
                name="targetLevel"
                label={t('expCalculator:targetLevel')}
                rules={[{ required: true, message: t('expCalculator:targetLevel_required') }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                  placeholder={t('expCalculator:targetLevel_placeholder')}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="default"
                  htmlType="submit"
                  icon={<Calculator size={16} />}
                  loading={loading}
                >
                  {t('expCalculator:calculate')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
          {loading && (
            <Card style={{ marginTop: 16 }}>
              <Spin />
            </Card>
          )}
          {error && (
            <Card style={{ marginTop: 16 }}>
              <Alert message={error} type="error" showIcon />
            </Card>
          )}
          {result && (
            <Card title={t('expCalculator:result')} style={{ marginTop: 16 }}>
              <Alert
                message={`${t('expCalculator:requiredExp')}: ${result.requiredExp}`}
                type="success"
                showIcon
              />
            </Card>
          )}
        </Col>
      </Row>
    </Layout>
  );
};

/**
 * @description 经验计算器页面包装组件
 * 使用Ant Design的App组件包装经验计算器，以支持全局消息提示功能
 * @returns {React.ReactElement} - 渲染的组件
 */
const ExpCalculatorPage = () => (
  <App>
    <ExpCalculator />
  </App>
);

export default ExpCalculatorPage;
