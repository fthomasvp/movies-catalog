import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva(
  [
    "cursor-pointer",
    "font-semibold",
    "border",
    "rounded-lg",
    "transition-colors",
    "focus:outline",
    "focus:outline-4",
    "focus:outline-rewee-yellow",
    "hover:border-rewee-yellow",
  ],
  {
    variants: {
      intent: {
        solid: ["bg-rewee-black", "text-white", "border-white"],
        outline: ["bg-gray-200", "text-rewee-black", "border-black"],
      },
      size: {
        small: ["text-sm", "py-1", "px-2"],
        medium: ["text-base", "py-2", "px-4"],
        large: ["text-lg", "py-3", "px-6"],
      },
    },
    defaultVariants: {
      intent: "solid",
      size: "medium",
    },
  }
);
type ButtonVariantProps = VariantProps<typeof button>;
type RequiredProps = keyof ButtonVariantProps;
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonVariantProps, RequiredProps> &
  Required<Pick<ButtonVariantProps, RequiredProps>> & {};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ intent, size, className, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={twMerge(button({ intent, size, className }))}
        {...props}
      />
    );
  }
);
