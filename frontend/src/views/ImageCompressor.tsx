import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  InputNumber,
  Popover,
  Row,
  Slider,
  Space,
  Typography,
  Upload,
} from 'antd';
import imageCompression from 'browser-image-compression';
import Layout from '../components/Layout';

const { Title, Text } = Typography;

import { Switch } from 'antd';

/**
 * @description 图片压缩设置面板组件
 * @param {object} props - 组件属性
 * @param {any} props.options - 压缩选项
 * @param {(options: any) => void} props.setOptions - 设置压缩选项的函数
 * @param {() => void} props.onCompress - 触发压缩的函数
 * @param {boolean} props.disabled - 是否禁用压缩按钮
 * @param {boolean} props.isBatchProcessing - 是否为批量处理模式
 * @param {(isBatch: boolean) => void} props.setIsBatchProcessing - 设置批量处理模式的函数
 * @returns {JSX.Element} 设置面板
 */
const SettingsPanel: React.FC<{
  options: any;
  setOptions: (options: any) => void;
  onCompress: () => void;
  disabled: boolean;
  isBatchProcessing: boolean;
  setIsBatchProcessing: (isBatch: boolean) => void;
}> = ({ options, setOptions, onCompress, disabled, isBatchProcessing, setIsBatchProcessing }) => {
  const { t } = useTranslation('imageCompressor');
  return (
    <div style={{ width: 300 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row align="middle">
          <Col span={8}>
            <Text>{t('batch_mode')}</Text>
          </Col>
          <Col span={16}>
            <Switch checked={isBatchProcessing} onChange={setIsBatchProcessing} />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>
            <Text>{t('width_px')}</Text>
          </Col>
          <Col span={16}>
            <InputNumber
              value={options.width}
              onChange={(value) => setOptions({ ...options, width: value || 0 })}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>
            <Text>{t('height_px')}</Text>
          </Col>
          <Col span={16}>
            <InputNumber
              value={options.height}
              onChange={(value) => setOptions({ ...options, height: value || 0 })}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>
            <Text>{t('max_size_mb')}</Text>
          </Col>
          <Col span={16}>
            <InputNumber
              min={0.1}
              max={10}
              step={0.1}
              value={options.maxSizeMB}
              onChange={(value) => setOptions({ ...options, maxSizeMB: value || 1 })}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>
            <Text>{t('quality_label')}</Text>
          </Col>
          <Col span={16}>
            <Slider
              min={0.1}
              max={1}
              step={0.01}
              value={options.quality}
              onChange={(value) => setOptions({ ...options, quality: value })}
            />
          </Col>
        </Row>
        <Button onClick={onCompress} disabled={disabled || isBatchProcessing}>
          {t('compress_button')}
        </Button>
      </Space>
    </div>
  );
};

/**
 * @description 图片压缩器主组件
 * @returns {JSX.Element} 图片压缩器页面
 */
const ImageCompressor: React.FC = () => {
  const { t } = useTranslation('imageCompressor');
  const { message } = App.useApp();

  /**
   * @description 原始图片的数据 URL
   */
  const [src, setSrc] = useState<string | null>(null);
  /**
   * @description 压缩后图片的数据 URL
   */
  const [output, setOutput] = useState<string | null>(null);
  /**
   * @description 原始图片文件对象
   */
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  /**
   * @description 批量处理的文件列表
   */
  const [fileList, setFileList] = useState<File[]>([]);
  /**
   * @description 是否为批量处理模式
   */
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  /**
   * @description 压缩选项
   */
  const [options, setOptions] = useState({
    width: 960,
    height: 560,
    maxSizeMB: 1,
    quality: 0.8,
  });
  /**
   * @description 预览区域的缩放比例
   */
  const [previewScale, setPreviewScale] = useState(1);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef<any>(null);

  /**
   * @description 动态计算预览区域的缩放比例
   */
  useLayoutEffect(() => {
    if (viewportRef.current) {
      const { clientWidth, clientHeight } = viewportRef.current;
      const scaleX = clientWidth / (options.width + 40); // Add some padding
      const scaleY = clientHeight / (options.height + 40);
      setPreviewScale(Math.min(scaleX, scaleY, 1));
    }
  }, [src, options.width, options.height]);

  /**
   * @description 清除当前图片和状态
   */
  const handleClear = () => {
    setSrc(null);
    setOutput(null);
    setOriginalFile(null);
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  };

  /**
   * @description 选择单个文件进行处理
   * @param {File} file - 用户选择的文件
   */
  const onSelectFile = (file: File) => {
    handleClear();
    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => setSrc(reader.result as string));
    reader.readAsDataURL(file);
  };

  /**
   * @description 选择多个文件进行批量处理
   * @param {File[]} files - 用户选择的文件列表
   */
  const onSelectFiles = (files: File[]) => {
    handleClear();
    setFileList(files);
    setIsBatchProcessing(true);
    processNextFileInQueue(files);
  };

  /**
   * @description 处理批量队列中的下一个文件
   * @param {File[]} queue - 文件队列
   */
  const processNextFileInQueue = (queue: File[]) => {
    if (queue.length > 0) {
      const nextFile = queue[0];
      onSelectFile(nextFile);
    } else {
      setIsBatchProcessing(false);
      message.success(t('batch_complete'));
    }
  };

  /**
   * @description 在批量模式下，当新文件加载时自动开始压缩
   */
  React.useEffect(() => {
    if (isBatchProcessing && src) {
      handleCompress();
    }
  }, [src, isBatchProcessing]);

  /**
   * @description 执行图片裁剪和压缩
   */
  const handleCompress = async () => {
    if (!src || !imgRef.current) {
      message.error(t('upload_first'));
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      message.error(t('canvas_error'));
      return;
    }

    const { scale, positionX, positionY } = transformRef.current.instance.transformState;
    const containerRect = viewportRef.current!.getBoundingClientRect();

    // Calculate the source crop area relative to the original image
    const sx = (containerRect.width / 2 - positionX - (options.width * previewScale) / 2) / scale;
    const sy = (containerRect.height / 2 - positionY - (options.height * previewScale) / 2) / scale;
    const sWidth = (options.width * previewScale) / scale;
    const sHeight = (options.height * previewScale) / scale;

    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, options.width, options.height);

    const imageBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, originalFile?.type || 'image/png')
    );

    if (!imageBlob) {
      message.error(t('crop_failed'));
      return;
    }

    try {
      const fileToCompress = new File([imageBlob], originalFile!.name, {
        type: originalFile!.type,
        lastModified: Date.now(),
      });

      const compressedFile = await imageCompression(fileToCompress, {
        maxSizeMB: options.maxSizeMB,
        useWebWorker: true,
        initialQuality: options.quality,
      });

      // For batch processing, we can handle the output differently, e.g., store in a list
      if (isBatchProcessing) {
        // In a real scenario, you'd collect these outputs
        message.info(`${t('compression_success')}: ${originalFile!.name}`);
        const updatedList = fileList.slice(1);
        setFileList(updatedList);
        processNextFileInQueue(updatedList);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setOutput(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
        message.success(t('compression_success'));
      }
    } catch (error) {
      message.error(t('compression_error'));
      console.error(error);
    }
  };

  /**
   * @description 下载压缩后的图片
   */
  const handleDownload = () => {
    if (output) {
      const link = document.createElement('a');
      link.href = output;
      link.download = `compressed-${originalFile?.name || 'image.png'}`;
      link.click();
    }
  };

  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>{t('title')}</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Card
              title={t('upload_and_crop')}
              extra={
                <Popover
                  content={
                    <SettingsPanel
                      options={options}
                      setOptions={setOptions}
                      onCompress={handleCompress}
                      disabled={!src}
                      isBatchProcessing={isBatchProcessing}
                      setIsBatchProcessing={setIsBatchProcessing}
                    />
                  }
                  title={t('settings')}
                  trigger="click"
                >
                  <Button icon={<SettingOutlined />} shape="circle" />
                </Popover>
              }
            >
              <Space>
                <Upload
                  accept="image/*"
                  multiple={isBatchProcessing}
                  beforeUpload={(file, fileList) => {
                    if (isBatchProcessing) {
                      onSelectFiles(fileList);
                    } else {
                      onSelectFile(file);
                    }
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>{t('select_image')}</Button>
                </Upload>
                {src && <Button onClick={handleClear}>{t('clear')}</Button>}
              </Space>
              {src && (
                <div
                  ref={viewportRef}
                  style={{
                    marginTop: 16,
                    width: '100%',
                    height: 'calc(100vh - 400px)',
                    overflow: 'hidden',
                    border: '1px solid #ccc',
                    position: 'relative',
                  }}
                >
                  <TransformWrapper
                    ref={transformRef}
                    initialScale={1}
                    initialPositionX={0}
                    initialPositionY={0}
                    limitToBounds={false}
                    disablePadding={true}
                  >
                    <TransformComponent
                      wrapperStyle={{
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <img
                        ref={imgRef}
                        src={src}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </TransformComponent>
                  </TransformWrapper>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: options.width * previewScale,
                      height: options.height * previewScale,
                      pointerEvents: 'none',
                      border: '2px dashed rgba(255, 255, 255, 0.7)',
                    }}
                  />
                  {/* Mask using 4 divs */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Top */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `calc(50% - ${(options.height * previewScale) / 2}px)`,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                    />
                    {/* Bottom */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: `calc(50% - ${(options.height * previewScale) / 2}px)`,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                    />
                    {/* Left */}
                    <div
                      style={{
                        position: 'absolute',
                        top: `calc(50% - ${(options.height * previewScale) / 2}px)`,
                        left: 0,
                        width: `calc(50% - ${(options.width * previewScale) / 2}px)`,
                        height: `${options.height * previewScale}px`,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                    />
                    {/* Right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: `calc(50% - ${(options.height * previewScale) / 2}px)`,
                        right: 0,
                        width: `calc(50% - ${(options.width * previewScale) / 2}px)`,
                        height: `${options.height * previewScale}px`,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        {output && (
          <Card title={t('preview_and_download')} style={{ marginTop: 16 }}>
            <img src={output} alt={t('compressed_image_alt')} style={{ maxWidth: '100%' }} />
            <Button onClick={handleDownload} style={{ marginTop: 16 }}>
              {t('download_button')}
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

/**
 * @description 图片压缩器页面的容器组件，包裹 Ant Design 的 App 组件以使用 message 等上下文
 * @returns {JSX.Element} 页面容器
 */
const ImageCompressorPage = () => (
  <App>
    <ImageCompressor />
  </App>
);

export default ImageCompressorPage;
