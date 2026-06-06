"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  glowClassName?: string;
}

export function AuroraButton({
  className,
  children,
  glowClassName,
  ...props
}: AuroraButtonProps) {
  return (
    <div className="relative group">
      {/* Animated glow border */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-lg opacity-60 blur-md transition-all duration-300",
          "group-hover:opacity-90 group-hover:blur-lg",
          "bg-gradient-to-r from-emerald-500 via-green-300 to-teal-400",
          glowClassName
        )}
      />
      {/* Button */}
      <button
        className={cn(
          "relative rounded-lg px-4 py-2",
          "bg-[#0f1f18]/90 border border-emerald-900/60",
          "text-emerald-100 text-[11px] font-bold tracking-widest uppercase",
          "shadow-lg transition-all duration-200",
          "hover:bg-[#0f1f18]/70",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
