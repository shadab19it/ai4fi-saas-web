import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type ButtonVariant = "outline" | "primary" | "gradient" | "soft" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  outline:
    "border border-[#E5E2DA] bg-white text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 hover:border-[#D0CBBF]",
  primary:
    "bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm",
  gradient:
    "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)]",
  soft:
    "bg-[#EEF3FF] text-[#0F62FE] hover:bg-[#DDE7FF]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  ghost:
    "text-[#6B6560] hover:text-stone-900 hover:bg-[#F9F8F5]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded-lg",
  md: "h-8 px-3 text-[12px] gap-1.5 rounded-lg",
  lg: "h-10 px-5 text-[14px] gap-2 rounded-xl",
  icon: "w-8 h-8 rounded-lg",
};

const Button: FC<ButtonProps> = ({
  variant = "outline",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const isIconOnly = size === "icon";

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className={clsx("animate-spin", isIconOnly ? "w-4 h-4" : "w-3.5 h-3.5")} />
      ) : icon ? (
        <span className='shrink-0'>{icon}</span>
      ) : null}
      {!isIconOnly && children && <span>{children}</span>}
    </button>
  );
};

export default Button;
