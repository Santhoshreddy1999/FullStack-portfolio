import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-white/12 bg-[#0D0F17]/90 px-3.5 py-2 text-sm text-[#F5F7FF] placeholder:text-[#969BB0]/65 transition-colors focus-visible:outline-none focus-visible:border-[#5B8CFF] focus-visible:ring-1 focus-visible:ring-[#5B8CFF] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
