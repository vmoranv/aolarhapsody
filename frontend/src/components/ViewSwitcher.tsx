import React, { useState } from 'react';
import { Tag } from 'antd';

/**
 * @description 视图接口
 * @property {string} key - 视图的唯一标识
 * @property {React.ReactNode} label - 视图的标签
 * @property {React.ReactNode} content - 视图的内容
 */
interface View {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

/**
 * @description ViewSwitcher 组件的 props
 * @property {View[]} views - 视图列表
 */
interface ViewSwitcherProps {
  views: View[];
}

/**
 * @description 视图切换器组件，用于在不同的视图之间进行切换
 * @param {ViewSwitcherProps} props - 组件 props
 * @returns {React.ReactElement} - 渲染的组件
 */
const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ views }) => {
  const [activeViewKey, setActiveViewKey] = useState(views[0].key);

  return (
    <>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '0 24px' }}>
        {views.map((view) => (
          <Tag.CheckableTag
            key={view.key}
            checked={activeViewKey === view.key}
            onChange={() => setActiveViewKey(view.key)}
            style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
          >
            {view.label}
          </Tag.CheckableTag>
        ))}
      </div>
      {views.find((v) => v.key === activeViewKey)?.content}
    </>
  );
};

export default ViewSwitcher;
