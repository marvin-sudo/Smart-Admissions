import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  iconBg?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  badge,
  badgeColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  onClick,
  iconBg = 'bg-[#F3E8FF] dark:bg-purple-950/50',
  iconColor = 'text-[#6C3EF4] dark:text-purple-400'
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white dark:bg-[#111827] p-4 sm:p-5 rounded-2xl
        border border-slate-200/80 dark:border-slate-800
        shadow-xs hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-purple-300 dark:hover:border-purple-600' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
          {value}
        </span>
        {badge && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
