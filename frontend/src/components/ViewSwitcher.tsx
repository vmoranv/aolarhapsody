import { Tag } from 'antd';
import React, { useState } from 'react';

interface View {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface ViewSwitcherProps {
  views: View[];
}

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
