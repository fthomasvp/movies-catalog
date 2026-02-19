import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const button = cva(
  [
    "ui:cursor-pointer",
    "ui:font-semibold",
    "ui:border",
    "ui:rounded-lg",
    "ui:transition-colors",
    "ui:focus:outline",
    "ui:focus:outline-4",
    "ui:focus:outline-system-yellow",
    "ui:hover:border-system-yellow",
  ],
  {
    variants: {
      intent: {
        solid: ["ui:bg-black", "ui:text-white", "ui:border-white"],
        outline: ["ui:bg-gray-200", "ui:text-black", "ui:border-black"],
      },
      size: {
        small: ["ui:text-sm", "ui:py-1", "ui:px-2"],
        medium: ["ui:text-base", "ui:py-2", "ui:px-4"],
        large: ["ui:text-lg", "ui:py-3", "ui:px-6"],
      },
    },
    defaultVariants: {
      intent: "solid",
      size: "medium",
    },
  },
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
        className={twMerge(button({ intent, size }), className)}
        {...props}
      />
    );
  },
);
