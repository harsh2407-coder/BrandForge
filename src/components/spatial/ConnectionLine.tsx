import React from 'react';

interface ConnectionLineProps {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
  strokeColor?: string;
  strokeWidth?: number;
  isDashed?: boolean;
  pulse?: boolean;
  className?: string;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  strokeColor = 'rgba(255, 255, 255, 0.12)',
  strokeWidth = 1,
  isDashed = true,
  pulse = false,
  className = '',
}) => {
  return (
    <svg className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isDashed ? '4, 4' : undefined}
        className={pulse ? 'animate-pulse' : ''}
      />
    </svg>
  );
};
