import React, { useState } from 'react';
import { Pivot, PivotItem } from '@fluentui/react';

const Tabs = ({ tabs = [] }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="tabs">
      <Pivot selectedKey={tabs[active]?.label} onLinkClick={(item) => {
        const idx = tabs.findIndex(t => t.label === item.props.headerText);
        if (idx >= 0) setActive(idx);
      }}>
        {tabs.map((tab) => (
          <PivotItem headerText={tab.label} key={tab.label}>
            <div className="tab-content">{tab.content}</div>
          </PivotItem>
        ))}
      </Pivot>
    </div>
  );
};

export default Tabs;
