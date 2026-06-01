import type { LucideIcon } from 'lucide-react';

type BrandIconProps = {
  icon: LucideIcon;
  label?: string;
  className?: string;
  iconClassName?: string;
  tone?: 'light' | 'dark';
  accent?: 'red' | 'blue' | 'cyan' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeMap = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
};

export default function BrandIcon({
  icon: Icon,
  label,
  className = '',
  iconClassName = '',
  tone = 'light',
  accent = 'red',
  size = 'md',
}: BrandIconProps) {
  const accentMap = {
    red: 'bg-brand-red text-white border-brand-red',
    blue: 'bg-brand-blue text-white border-brand-blue',
    cyan: 'bg-brand-cyan text-brand-navy border-brand-cyan',
    navy: 'bg-brand-navy text-white border-brand-navy',
  };

  const base =
    tone === 'dark'
      ? 'bg-white/10 text-white border-white/15'
      : accentMap[accent];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border shadow-sm ${sizeMap[size]} ${base} ${className}`.trim()}
      aria-hidden={label ? undefined : true}
      title={label}
    >
      <Icon className={`h-1/2 w-1/2 ${iconClassName}`} />
    </div>
  );
}
