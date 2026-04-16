import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EfficiencyGauge = ({ score }) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];
  
  // Color logic: Green if high, Yellow if mid, Red if low
  const color = score > 70 ? '#22c55e' : score > 50 ? '#eab308' : '#ef4444';

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#f3f4f6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-8">
        <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
        <p className="text-gray-400 text-sm">System Efficiency</p>
      </div>
    </div>
  );
};

export default EfficiencyGauge;