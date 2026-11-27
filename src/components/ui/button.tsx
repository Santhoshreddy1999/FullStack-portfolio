import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45E4FF] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#5B8CFF] text-[#07080D] font-semibold shadow-[0_0_28px_-6px_rgba(91,140,255,0.65)] hover:bg-[#749EFF] active:scale-[0.98]",
        secondary:
          "bg-[#151824] text-[#F5F7FF] border border-white/12 hover:border-[#5B8CFF]/50 hover:bg-[#1B2030]",
        outline:
          "border border-white/15 bg-transparent text-[#F5F7FF] hover:border-[#45E4FF]/60 hover:bg-white/[0.04]",
        ghost:
          "bg-transparent text-[#969BB0] hover:text-[#F5F7FF] hover:bg-white/[0.05]",
        cyan:
          "bg-[#45E4FF]/12 text-[#45E4FF] border border-[#45E4FF]/35 hover:bg-[#45E4FF]/20",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-sm tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
