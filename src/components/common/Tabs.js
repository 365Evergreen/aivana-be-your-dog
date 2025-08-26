import React, { useState } from 'react';
const Tabs = ({ tabs = [] }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab, i) => (
          <button key={tab.label} className={active === i ? 'active' : ''} onClick={() => setActive(i)}>{tab.label}</button>
        ))}
      </div>
      <div className="tab-content">{tabs[active] && tabs[active].content}</div>
    </div>
  );
};
export default Tabs;
