import React from 'react';
import './OrderTabs.css';

export default function OrderTabs({ selectedStatus, onChangeStatus }) {
  const tabs = ['In Process', 'Completed', 'Cancelled'];

  return (
    <div className="order-tabs">
  <div className="tab-group">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={`tab-btn ${selectedStatus === tab ? 'active' : ''}`}
        onClick={() => onChangeStatus(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
</div>

  );
}
