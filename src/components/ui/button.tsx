import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
    primary: "bg-gradient-to-r from-accent to-accent-strong text-white shadow-[0_6px_18px_rgb(134_93_255/0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgb(134_93_255/0.32)]",
    secondary: "bg-accent-soft text-accent-strong hover:bg-accent-soft-hover",
    ghost: "text-muted hover:bg-panel-highlight hover:text-foreground",
};

export function Button({ className = "", type = "button", variant = "primary", ...props }: ButtonProps) {
    return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 font-semibold transition ${variantClasses[variant]} ${className}`} type={type} {...props} />;
}
