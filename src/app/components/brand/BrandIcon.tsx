import type { LucideIcon } from 'lucide-react';

type BrandIconProps = {
  icon: LucideIcon;
  label?: string;
  className?: string;
  iconClassName?: string;
  tone?: 'light' | 'dark';
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
  size = 'md',
}: BrandIconProps) {
  const base =
    tone === 'dark'
      ? 'bg-white/10 text-white border-white/15'
      : 'bg-white text-[#F71C56] border-[#e6bcbf]';

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
