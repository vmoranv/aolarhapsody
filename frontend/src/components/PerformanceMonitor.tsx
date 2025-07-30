import { Card, Col, Row, Switch, Typography } from 'antd';
import { Activity, Clock, Cpu, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const { Text } = Typography;

interface PerformanceStats {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
}

const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderTime: 0,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isMonitoring) {
      const measurePerformance = () => {
        const now = performance.now();
        frameCountRef.current++;

        // 计算 FPS
        if (now - lastTimeRef.current >= 1000) {
          const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
          const frameTime = (now - lastTimeRef.current) / frameCountRef.current;

          // 获取内存使用情况（如果支持）
          const memoryUsage = (performance as any).memory
            ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
            : 0;

          setStats((prev) => ({
            ...prev,
            fps,
            frameTime: Math.round(frameTime * 100) / 100,
            memoryUsage,
          }));

          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }

        animationIdRef.current = requestAnimationFrame(measurePerformance);
      };

      measurePerformance();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isMonitoring]);

  // 监听主题切换事件
  useEffect(() => {
    const handleThemeChange = () => {
      const startTime = performance.now();

      // 使用 requestAnimationFrame 来测量渲染时间
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime;
        setStats((prev) => ({
          ...prev,
          renderTime: Math.round(renderTime * 100) / 100,
        }));
      });
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // 键盘快捷键切换显示
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible((prev) => !prev);
        setIsMonitoring((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: '12px',
          cursor: 'pointer',
        }}
        onClick={() => {
          setIsVisible(true);
          setIsMonitoring(true);
        }}
      >
        📊 Ctrl+Shift+P
      </div>
    );
  }

  return (
    <Card
      size="small"
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        width: 280,
        zIndex: 9999,
        fontSize: '12px',
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={16} />
          <span>性能监控</span>
          <Switch size="small" checked={isMonitoring} onChange={setIsMonitoring} />
        </div>
      }
      extra={
        <span style={{ cursor: 'pointer' }} onClick={() => setIsVisible(false)}>
          ✕
        </span>
      }
    >
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap
              size={14}
              color={stats.fps >= 55 ? '#52c41a' : stats.fps >= 30 ? '#faad14' : '#ff4d4f'}
            />
            <Text strong>FPS:</Text>
            <Text
              style={{
                color: stats.fps >= 55 ? '#52c41a' : stats.fps >= 30 ? '#faad14' : '#ff4d4f',
              }}
            >
              {stats.fps}
            </Text>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} />
            <Text strong>帧时间:</Text>
            <Text>{stats.frameTime}ms</Text>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Cpu size={14} />
            <Text strong>内存:</Text>
            <Text>{stats.memoryUsage}MB</Text>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Activity size={14} />
            <Text strong>渲染:</Text>
            <Text style={{ color: stats.renderTime > 16 ? '#ff4d4f' : '#52c41a' }}>
              {stats.renderTime}ms
            </Text>
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: 8, fontSize: '11px', color: '#666' }}>
        <div>• FPS &gt; 55: 流畅 | 30-55: 一般 | &lt; 30: 卡顿</div>
        <div>• 渲染时间 &gt; 16ms 可能导致掉帧</div>
        <div>• Ctrl+Shift+P 切换显示</div>
      </div>
    </Card>
  );
};

export default PerformanceMonitor;
