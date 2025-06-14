"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "icon";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, href, children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-primary hover:bg-primary-hover active:bg-primary-active text-white focus:ring-primary",
      secondary:
        "bg-secondary hover:bg-secondary-hover active:bg-secondary-active text-white focus:ring-secondary",
      tertiary:
        "bg-transparent hover:bg-light-dark text-dark dark:text-white border border-medium focus:ring-primary",
      icon: "bg-transparent hover:bg-light-dark text-dark dark:text-white p-2 rounded-full focus:ring-primary",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    };

    // If href is provided, render an anchor tag styled as a button
    if (href) {
      return (
        <a
          href={href}
          className={cn(
            baseStyles,
            variantStyles[variant],
            variant !== "icon" && sizeStyles[size],
            className
          )}
        >
          {children}
        </a>
      );
    }

    // Otherwise render a button
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "icon" && sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
