import { Alert, App, Button, Card, Col, Form, InputNumber, Row, Spin, Typography } from 'antd';
import { Calculator } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;

interface ExpCalculationResult {
  requiredExp: number;
}

const ExpCalculator: React.FC = () => {
  const { t } = useTranslation(['miscellaneous', 'expCalculator']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExpCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleCalculate = async (values: {
    petId: string;
    currentLevel: number;
    currentExp: number;
    targetLevel: number;
  }) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/exp/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.error || t('expCalculator:calculation_failed'));
      }
    } catch (err) {
      setError(t('expCalculator:calculation_failed') + ': ' + (err as Error).message);
    } finally {
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

const ExpCalculatorPage = () => (
  <App>
    <ExpCalculator />
  </App>
);

export default ExpCalculatorPage;
