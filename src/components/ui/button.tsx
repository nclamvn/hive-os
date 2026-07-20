import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const base =
  "text-body inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Navy background, white text, 40px high, 8px radius, hover darkens one step.
  primary: "bg-navy-800 text-white hover:bg-navy-900",
  // White background, 1px line border, ink text.
  secondary: "border border-line bg-surface text-ink hover:bg-surface-subtle",
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
