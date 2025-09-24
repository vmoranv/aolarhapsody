import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Switch, Typography } from 'antd';
import { Activity, Clock, Cpu, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const { Text } = Typography;

/**
 * @file PerformanceMonitor.tsx
 * @description
 * 一个用于实时监控前端性能的React组件。
 * 它以浮动窗口的形式展示应用的FPS、帧时间、内存使用情况和特定事件（如主题切换）的渲染时间。
 * 当性能指标低于阈值时，会在控制台输出警告，帮助开发者定位性能问题。
 */

/**
 * 定义性能统计数据的结构。
 */
interface PerformanceStats {
  /** 每秒帧数 (Frames Per Second) */
  fps: number;
  /** 渲染单帧所需的平均时间 (毫秒) */
  frameTime: number;
  /** JS堆内存使用量 (MB) */
  memoryUsage: number;
  /** 特定操作（如主题切换）的渲染时间 (毫秒) */
  renderTime: number;
}

/**
 * 性能监控组件。
 * 使用 `requestAnimationFrame` 来持续测量性能指标，并通过状态更新UI。
 * 提供了快捷键 (Ctrl+Shift+P) 来切换显示/隐藏。
 * @returns {React.ReactElement | null} 渲染的性能监控面板，或者在隐藏时返回 null。
 */
const PerformanceMonitor: React.FC = () => {
  const { colors } = useTheme()!;
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
  const measurementCountRef = useRef(0);

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

          setStats((prev) => {
            const newStats = {
              ...prev,
              fps,
              frameTime: Math.round(frameTime * 100) / 100,
              memoryUsage,
            };

            // 预热期（前2次测量）不触发警报，以避免初始误报
            if (measurementCountRef.current > 2) {
              if (newStats.fps < 30 && newStats.fps > 0) {
                console.error(
                  `性能警报：FPS 过低 (${newStats.fps})。这可能表明某个组件的渲染或逻辑开销过大。请使用 React DevTools Profiler 进行分析。`
                );
              }
              if (newStats.frameTime > 33) {
                console.error(
                  `性能警报：帧时间过长 (${newStats.frameTime}ms)。这可能表明某个组件的渲染或逻辑开销过大。请使用 React DevTools Profiler 进行分析。`
                );
              }
              if (prev.memoryUsage > 0 && newStats.memoryUsage > prev.memoryUsage + 50) {
                console.error(
                  `性能警报：内存使用量激增（超过50MB）。当前使用量：${newStats.memoryUsage}MB。请检查是否存在内存泄漏。`
                );
              }
            }

            return newStats;
          });

          measurementCountRef.current++;
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
        if (renderTime > 16) {
          console.error(
            `性能警报：主题切换渲染时间过长 (${renderTime.toFixed(
              2
            )}ms)。这可能是由于大量组件重新渲染引起的。请使用 React DevTools Profiler 进行分析。`
          );
        }
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
          background: colors.elevated,
          color: colors.text,
          padding: '4px 8px',
          borderRadius: 8,
          fontSize: '12px',
          cursor: 'pointer',
          border: `1px solid ${colors.borderSecondary}`,
          boxShadow: `0 2px 8px ${colors.shadow}`,
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

      <div style={{ marginTop: 8, fontSize: '11px', color: colors.textSecondary }}>
        <div>• FPS &gt; 55: 流畅 | 30-55: 一般 | &lt; 30: 卡顿</div>
        <div>• 渲染时间 &gt; 16ms 可能导致掉帧</div>
        <div>• Ctrl+Shift+P 切换显示</div>
      </div>
    </Card>
  );
};

export default PerformanceMonitor;
