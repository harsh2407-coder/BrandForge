import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface StrategicNodeProps {
  id: string;
  label: string;
  category?: string;
  description?: string;
  status?: 'locked' | 'active' | 'verified';
  accentColor?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: string;
}

export const StrategicNode: React.FC<StrategicNodeProps> = ({
  label,
  category,
  description,
  status = 'active',
  accentColor = '#f59e0b',
  isSelected = false,
  onClick,
  className = '',
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left p-4 sm:p-5 rounded-2xl spatial-surface transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-amber-400/80 bg-[#221f1c]/80 shadow-2xl scale-[1.02]'
          : 'hover:border-white/20 hover:bg-[#1a1816]/80'
      } ${className}`}
    >
      {/* Delicate node beacon glow */}
      <div 
        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 12px ${accentColor}`,
        }}
      />

      <div className="flex items-center justify-between gap-3 mb-2">
        {category && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a89f92]">
            {category}
          </span>
        )}
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#d4cbbf]">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold tracking-tight text-[#f4efe8] group-hover:text-white transition-colors">
          {label}
        </h3>
        <ArrowUpRight className="w-4 h-4 text-[#8a8175] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
      </div>

      {description && (
        <p className="text-xs text-[#a39a8e] mt-1.5 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}
    </button>
  );
};
