import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm text-text-muted mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-11 px-4 bg-bg-elevated border border-border rounded-lg text-text placeholder:text-text-dim focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-colors ${error ? "border-pink" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-pink">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
