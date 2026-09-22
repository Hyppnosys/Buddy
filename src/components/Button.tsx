import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-(--color-focus) text-white hover:opacity-90 shadow-(--shadow-soft) active:scale-[0.97]',
  secondary: 'bg-(--color-surface-alt) text-(--color-ink) hover:bg-(--color-border) active:scale-[0.97]',
  ghost: 'bg-transparent text-(--color-ink-muted) hover:bg-(--color-surface-alt) active:scale-[0.97]',
  danger: 'bg-(--color-danger) text-white hover:opacity-90 active:scale-[0.97]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-14 px-7 text-base gap-2.5',
};

export function Button({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-semibold
        transition-all duration-200 ease-out disabled:opacity-40 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
