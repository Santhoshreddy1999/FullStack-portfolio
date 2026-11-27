import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/12 bg-white/[0.04] text-[#F5F7FF]",
        blue: "border-[#5B8CFF]/35 bg-[#5B8CFF]/12 text-[#8EB0FF]",
        violet: "border-[#9B6BFF]/35 bg-[#9B6BFF]/12 text-[#C2A4FF]",
        cyan: "border-[#45E4FF]/35 bg-[#45E4FF]/10 text-[#7CEEFF]",
        orange: "border-[#FF9B62]/35 bg-[#FF9B62]/12 text-[#FFB68A]",
        muted: "border-white/8 bg-[#10121B]/80 text-[#969BB0]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
