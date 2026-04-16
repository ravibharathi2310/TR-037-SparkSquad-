import React from 'react';

const MetricCard = ({ title, value, unit, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></h3>
    </div>
  </div>
);

export default MetricCard;