type BrandMarkProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
};

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

export default function BrandMark({
  className = '',
  size = 'md',
  'aria-label': ariaLabel = 'Cardinal Immersions',
}: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`inline-block ${sizeMap[size]} ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
    >
      <circle cx="32" cy="32" r="21" fill="none" stroke="#0A1C3A" strokeWidth="5" />
      <circle cx="32" cy="32" r="11.5" fill="none" stroke="#0A1C3A" strokeWidth="5" opacity="0.9" />
      <circle cx="47" cy="17" r="6.5" fill="#F71C56" />
    </svg>
  );
}
