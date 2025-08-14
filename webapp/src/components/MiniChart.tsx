import React from 'react';

interface MiniChartProps {
  data: number[];
  positive: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, positive }) => {
  if (!data || data.length === 0) {
    return <div className="w-20 h-8 bg-gray-100 rounded"></div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 80;
    const y = 32 - ((value - min) / range) * 32;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-20 h-8">
      <svg width="80" height="32" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};
