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
import React, { useLayoutEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import Layout from '../components/Layout';

const { Title, Text } = Typography;

import { Switch } from 'antd';

const SettingsPanel: React.FC<{
  options: any;
  setOptions: (options: any) => void;
  onCompress: () => void;
  disabled: boolean;
  isBatchProcessing: boolean;
  setIsBatchProcessing: (isBatch: boolean) => void;
}> = ({ options, setOptions, onCompress, disabled, isBatchProcessing, setIsBatchProcessing }) => (
  <div style={{ width: 300 }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Row align="middle">
        <Col span={8}>
          <Text>批量模式</Text>
        </Col>
        <Col span={16}>
          <Switch checked={isBatchProcessing} onChange={setIsBatchProcessing} />
        </Col>
      </Row>
      <Row align="middle">
        <Col span={8}>
          <Text>宽度 (px)</Text>
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
          <Text>高度 (px)</Text>
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
          <Text>最大文件大小 (MB)</Text>
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
          <Text>图片质量</Text>
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
        压缩图片
      </Button>
    </Space>
  </div>
);

const ImageCompressor: React.FC = () => {
  const { message } = App.useApp();
  const [src, setSrc] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [options, setOptions] = useState({
    width: 960,
    height: 560,
    maxSizeMB: 1,
    quality: 0.8,
  });
  const [previewScale, setPreviewScale] = useState(1);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (viewportRef.current) {
      const { clientWidth, clientHeight } = viewportRef.current;
      const scaleX = clientWidth / (options.width + 40); // Add some padding
      const scaleY = clientHeight / (options.height + 40);
      setPreviewScale(Math.min(scaleX, scaleY, 1));
    }
  }, [src, options.width, options.height]);

  const handleClear = () => {
    setSrc(null);
    setOutput(null);
    setOriginalFile(null);
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  };

  const onSelectFile = (file: File) => {
    handleClear();
    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => setSrc(reader.result as string));
    reader.readAsDataURL(file);
  };

  const onSelectFiles = (files: File[]) => {
    handleClear();
    setFileList(files);
    setIsBatchProcessing(true);
    processNextFileInQueue(files);
  };

  const processNextFileInQueue = (queue: File[]) => {
    if (queue.length > 0) {
      const nextFile = queue[0];
      onSelectFile(nextFile);
    } else {
      setIsBatchProcessing(false);
      message.success('批量处理完成！');
    }
  };

  // Auto-compress when a new file is loaded in batch mode
  React.useEffect(() => {
    if (isBatchProcessing && src) {
      handleCompress();
    }
  }, [src, isBatchProcessing]);

  const handleCompress = async () => {
    if (!src || !imgRef.current) {
      message.error('请先上传图片');
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      message.error('无法获取画布上下文');
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
      message.error('裁剪失败');
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
        message.info(`压缩成功: ${originalFile!.name}`);
        const updatedList = fileList.slice(1);
        setFileList(updatedList);
        processNextFileInQueue(updatedList);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setOutput(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
        message.success('压缩成功');
      }
    } catch (error) {
      message.error('压缩失败');
      console.error(error);
    }
  };

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
        <Title level={2}>图片裁剪与压缩</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Card
              title="上传与裁剪"
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
                  title="设置"
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
                  <Button icon={<UploadOutlined />}>选择图片</Button>
                </Upload>
                {src && <Button onClick={handleClear}>清除</Button>}
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
          <Card title="预览与下载" style={{ marginTop: 16 }}>
            <img src={output} alt="Compressed" style={{ maxWidth: '100%' }} />
            <Button onClick={handleDownload} style={{ marginTop: 16 }}>
              下载图片
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

const ImageCompressorPage = () => (
  <App>
    <ImageCompressor />
  </App>
);

export default ImageCompressorPage;
