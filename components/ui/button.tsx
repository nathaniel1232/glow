import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-purple text-bg hover:bg-purple/90 active:bg-purple/80",
      secondary: "bg-bg-elevated text-text border border-border hover:border-purple/40 hover:bg-bg-elevated/80",
      ghost: "text-text-muted hover:text-text hover:bg-bg-elevated",
      outline: "border border-border text-text hover:border-purple/40 hover:bg-purple/5",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md gap-1.5",
      md: "h-10 px-5 text-sm rounded-lg gap-2",
      lg: "h-12 px-7 text-base rounded-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
