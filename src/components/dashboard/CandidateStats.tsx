
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Approved', value: 45, color: '#9b30ff' },
  { name: 'Under Review', value: 30, color: '#4D91FF' },
  { name: 'Rejected', value: 25, color: '#FF5757' },
];

const COLORS = ['#9b30ff', '#4D91FF', '#FF5757'];

const CandidateStats: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Candidate Status</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} candidates`, '']}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                borderRadius: '0.375rem',
                color: '#f9fafb' 
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {data.map((item, index) => (
          <div key={index}>
            <div className="text-2xl font-semibold" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="text-gray-400 text-sm">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateStats;
