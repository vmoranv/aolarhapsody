import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * @description Overlay 组件的 props 接口
 * @interface OverlayProps
 * @property {React.RefObject<HTMLElement | null>} anchorRef - 锚点元素的 ref
 * @property {() => void} onClick - 点击遮罩层的回调函数
 * @property {number} [padding] - 镂空区域的内边距
 */
interface OverlayProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onClick: () => void;
  padding?: number;
}

/**
 * @description 创建一个带有镂空效果的遮罩层，用于引导用户操作
 * @param {OverlayProps} props - 组件 props
 */
const Overlay: React.FC<OverlayProps> = ({ anchorRef, onClick, padding = 4 }) => {
  const [holeStyle, setHoleStyle] = useState({
    cx: 0,
    cy: 0,
    r: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setHoleStyle({
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          r: Math.max(rect.width, rect.height) / 2 + padding,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, padding]);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <mask id="hole">
            <rect width="100%" height="100%" fill="white" />
            <circle cx={holeStyle.cx} cy={holeStyle.cy} r={holeStyle.r} fill="black" />
          </mask>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.5)"
          mask="url(#hole)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
};

export default Overlay;
