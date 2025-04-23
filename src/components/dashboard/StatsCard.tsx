
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon
}) => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-purple/30 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold text-white mt-2">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '↑' : '↓'} {change}
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-purple/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
