import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CompositionChart = ({ data }) => {
  // Mapping the raw state to the format Recharts expects
  const chartData = [
    { subject: 'Moisture', A: data.moisture_content_pct, fullMark: 100 },
    { subject: 'Carbon', A: data.carbon_content_pct, fullMark: 100 },
    { subject: 'Ash', A: data.ash_content_pct, fullMark: 100 },
    { subject: 'Volatile', A: data.volatile_matter_pct, fullMark: 100 },
    { subject: 'Fixed Carbon', A: data.fixed_carbon_pct, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Waste Profile"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompositionChart;