import { Alert, App, Button, Card, Col, Input, Row, Spin, Typography } from 'antd';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const BadwordCheck: React.FC = () => {
  const { t } = useTranslation(['miscellaneous', 'badwordCheck']);
  const { message } = App.useApp();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isIllegal: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) {
      message.warning(t('badwordCheck:please_enter_text'));
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/badwordcheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || t('badwordCheck:check_failed'));
      }
    } catch (err) {
      setError(t('badwordCheck:check_failed') + ': ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Title level={2}>{t('badwordCheck:title')}</Title>
      <Paragraph>{t('badwordCheck:description')}</Paragraph>
      <Row gutter={16}>
        <Col span={24}>
          <Card title={t('badwordCheck:input')}>
            <TextArea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('badwordCheck:placeholder')}
            />
            <Button
              type="default"
              icon={<Search size={16} />}
              onClick={handleCheck}
              style={{ marginTop: 16 }}
              loading={loading}
            >
              {t('badwordCheck:check')}
            </Button>
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
            <Card title={t('badwordCheck:result')} style={{ marginTop: 16 }}>
              {result.isIllegal ? (
                <Alert message={t('badwordCheck:illegal')} type="error" showIcon />
              ) : (
                <Alert message={t('badwordCheck:legal')} type="success" showIcon />
              )}
            </Card>
          )}
        </Col>
      </Row>
    </Layout>
  );
};

const BadwordCheckPage = () => (
  <App>
    <BadwordCheck />
  </App>
);

export default BadwordCheckPage;
