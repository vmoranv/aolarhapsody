import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, App, Button, Card, Col, Input, Row, Spin, Typography } from 'antd';
import { Search } from 'lucide-react';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * @description 敏感词检查页面
 */
const BadwordCheck: React.FC = () => {
  // --- Hooks ---
  // 获取国际化翻译函数，同时加载 'miscellaneous' 和 'badwordCheck' 两个命名空间
  const { t } = useTranslation(['miscellaneous', 'badwordCheck']);
  // 使用Ant Design的App组件上下文，以调用全局消息提示
  const { message } = App.useApp();

  // --- State ---
  // 存储用户在文本域中输入的文本
  const [text, setText] = useState('');
  // 控制检查过程中的加载状态
  const [loading, setLoading] = useState(false);
  // 存储后端返回的检查结果
  const [result, setResult] = useState<{ isIllegal: boolean } | null>(null);
  // 存储API请求或处理过程中发生的错误信息
  const [error, setError] = useState<string | null>(null);

  /**
   * @description 处理“检查”按钮的点击事件。
   * 该函数会执行以下操作：
   * 1. 验证输入文本是否为空。
   * 2. 设置加载状态，并清空上一次的结果和错误信息。
   * 3. 发送POST请求到后端的 /api/badwordcheck 接口。
   * 4. 根据响应更新结果或错误状态。
   * 5. 无论成功或失败，最后都会取消加载状态。
   */
  const handleCheck = async () => {
    // 1. 输入验证：如果文本为空或只包含空白字符，则显示警告信息并中止执行
    if (!text.trim()) {
      message.warning(t('badwordCheck:please_enter_text'));
      return;
    }

    // 2. 重置状态：开始检查，显示加载动画，并清除旧的结果和错误
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // 3. 发送API请求
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/badwordcheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // 将文本作为JSON发送
      });

      const data = await response.json();

      // 4. 处理响应
      if (response.ok && data.success) {
        // 如果请求成功且业务逻辑也成功，则更新结果状态
        setResult(data.data);
      } else {
        // 如果请求或业务逻辑失败，则设置错误信息
        setError(data.message || t('badwordCheck:check_failed'));
      }
    } catch (err) {
      // 捕获网络请求等异常，并设置错误信息
      setError(t('badwordCheck:check_failed') + ': ' + (err as Error).message);
    } finally {
      // 5. 结束加载状态
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

/**
 * @description 敏感词检查页面的容器组件，用于提供 Ant Design 的 App 上下文
 */
const BadwordCheckPage = () => (
  <App>
    <BadwordCheck />
  </App>
);

export default BadwordCheckPage;
