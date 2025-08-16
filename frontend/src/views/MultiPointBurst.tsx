import type { InputNumberProps } from 'antd';
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { get } from 'lodash';
import { Copy, TestTube } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import {
  generateCombinationsFromPlaceholders,
  parseTemplateForPlaceholders,
  type Placeholder,
} from '../utils/burst-helper';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const MultiPointBurst: React.FC = () => {
  const { t } = useTranslation(['miscellaneous', 'multiPointBurst']);
  const { message } = App.useApp();
  const [template, setTemplate] = useState('');
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  const generatePreviewHtml = (text: string, phs: Placeholder[]): string => {
    if (!text || phs.length === 0) {
      return text;
    }

    const lines = text.split('\n');
    const colors = ['#ff4d4f', '#73d13d', '#40a9ff', '#ffc53d', '#9254de', '#36cfc9'];

    const uniquePaths = [...new Set(phs.map((p) => p.path))];
    const pathColorMap = new Map(uniquePaths.map((path, i) => [path, colors[i % colors.length]]));

    const processedLines = lines.map((line) => {
      let processedLine = line;
      try {
        const paramKey = '"param":';
        const paramIndex = line.indexOf(paramKey);
        if (paramIndex === -1) {
          return line;
        }

        const startIndex = line.indexOf('{', paramIndex);
        if (startIndex === -1) {
          return line;
        }

        let balance = 1;
        let endIndex = startIndex + 1;
        while (endIndex < line.length && balance > 0) {
          if (line[endIndex] === '{') {
            balance++;
          } else if (line[endIndex] === '}') {
            balance--;
          }
          endIndex++;
        }
        if (balance !== 0) {
          return line;
        }

        const paramJson = JSON.parse(line.substring(startIndex, endIndex));

        // A reverse sort ensures that deeper paths (e.g., 'a.b.c') are processed before shallower ones ('a.b').
        // This prevents parts of a path from being replaced incorrectly.
        const sortedPaths = [...uniquePaths].sort((a, b) => b.length - a.length);

        sortedPaths.forEach((path) => {
          const color = pathColorMap.get(path);
          const valueToHighlight = get(paramJson, path);

          if (valueToHighlight !== undefined && color) {
            // Important: We replace in the *original* line to avoid re-matching on already-spanned content.
            // But since we build up `processedLine`, we need to be careful.
            // The current implementation is okay since we replace the raw value, not a span.
            const regex = new RegExp(`(?<![\\d\\w])${valueToHighlight}(?![\\d\\w])`, 'g');
            processedLine = processedLine.replace(
              regex,
              `<span style="color: ${color}; font-weight: bold;">${valueToHighlight}</span>`
            );
          }
        });
        return processedLine;
      } catch {
        return line; // Return original line on error
      }
    });

    return processedLines.join('\n');
  };

  useEffect(() => {
    const parsedPlaceholders = parseTemplateForPlaceholders(template);
    // Ensure placeholders are unique by path for UI rendering
    const uniquePlaceholders = parsedPlaceholders.filter(
      (ph, index, self) => index === self.findIndex((p) => p.path === ph.path)
    );

    setPlaceholders(uniquePlaceholders);
    setSelectedPaths(uniquePlaceholders.map((p) => p.path)); // Default to select all
    const preview = generatePreviewHtml(template, uniquePlaceholders);
    setPreviewHtml(preview);
  }, [template]);

  const handleRangeChange = (
    path: string,
    key: 'start' | 'end',
    value: InputNumberProps['value']
  ) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setPlaceholders((prev) =>
      prev.map((p) => (p.path === path ? { ...p, range: { ...p.range, [key]: numValue || 0 } } : p))
    );
  };

  const handleGenerateClick = () => {
    const selectedPlaceholders = placeholders.filter((p) => selectedPaths.includes(p.path));
    const output = generateCombinationsFromPlaceholders(template, selectedPlaceholders);
    setResult(output);
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(
        () => {
          message.success(t('multiPointBurst:copySuccess'));
        },
        () => {
          message.error(t('multiPointBurst:copyFailed'));
        }
      );
    }
  };

  return (
    <Layout>
      <Title level={2}>{t('multiPointBurst:title')}</Title>
      <Paragraph>{t('multiPointBurst:description')}</Paragraph>
      <Row gutter={16}>
        <Col span={12}>
          <Card title={t('multiPointBurst:templateInput')}>
            <TextArea
              rows={10}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={t('multiPointBurst:templatePlaceholder')}
            />
          </Card>
          {previewHtml && (
            <Card title={t('multiPointBurst:templatePreview')} style={{ marginTop: 16 }}>
              <pre
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </Card>
          )}
          {placeholders.length > 0 && (
            <Card title={t('multiPointBurst:placeholderSettings')} style={{ marginTop: 16 }}>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={selectedPaths}
                onChange={(checkedValues) => setSelectedPaths(checkedValues as string[])}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {placeholders.map((ph) => (
                    <Row key={ph.path} gutter={8} align="middle">
                      <Col span={24}>
                        <Checkbox value={ph.path}>{ph.path}</Checkbox>
                      </Col>
                      {selectedPaths.includes(ph.path) && (
                        <>
                          <Col span={8} offset={2}>
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder={t('multiPointBurst:start')}
                              value={ph.range.start}
                              onChange={(value) => handleRangeChange(ph.path, 'start', value)}
                            />
                          </Col>
                          <Col span={8}>
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder={t('multiPointBurst:end')}
                              value={ph.range.end}
                              onChange={(value) => handleRangeChange(ph.path, 'end', value)}
                            />
                          </Col>
                        </>
                      )}
                    </Row>
                  ))}
                </Space>
              </Checkbox.Group>
            </Card>
          )}
          <Button
            type="default"
            icon={<TestTube size={16} />}
            onClick={handleGenerateClick}
            style={{ marginTop: 16, borderRadius: 8 }}
            disabled={placeholders.length === 0 || selectedPaths.length === 0}
          >
            {t('multiPointBurst:generate')}
          </Button>
        </Col>
        <Col span={12}>
          <Card
            title={t('multiPointBurst:result')}
            extra={
              <Tooltip title={t('multiPointBurst:copy')}>
                <Button icon={<Copy size={16} />} onClick={handleCopyResult} disabled={!result} />
              </Tooltip>
            }
          >
            <TextArea
              rows={15}
              value={result}
              readOnly
              placeholder={t('multiPointBurst:resultPlaceholder')}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

const MultiPointBurstPage = () => (
  <App>
    <MultiPointBurst />
  </App>
);

export default MultiPointBurstPage;
