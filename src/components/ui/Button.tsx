"use client";

import { type ButtonHTMLAttributes, type MouseEvent, useCallback, useRef } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
    primary: "bg-accent text-accent-ink hover:bg-accent-strong active:bg-accent-strong",
    secondary: "bg-accent-soft text-accent-strong hover:bg-accent-soft-hover active:bg-accent-soft-hover",
    ghost: "text-muted hover:bg-panel-highlight hover:text-foreground active:bg-panel-highlight",
};

const rippleBaseColor = "rgba(0, 0, 0, 0.1)";

export function Button({ className = "", type = "button", variant = "primary", onClick, ...props }: ButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const ripplesRef = useRef<HTMLDivElement | null>(null);

    const ensureRipples = useCallback((button: HTMLButtonElement) => {
        if (ripplesRef.current) return ripplesRef.current;
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.zIndex = "0";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.overflow = "clip";
        container.style.pointerEvents = "none";
        button.insertBefore(container, button.firstChild);
        ripplesRef.current = container;
        return container;
    }, []);

    const handleClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            const button = buttonRef.current;
            if (!button) {
                onClick?.(e);
                return;
            }
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const dist1 = Math.hypot(x, y);
            const dist2 = Math.hypot(rect.width - x, y);
            const dist3 = Math.hypot(x, rect.height - y);
            const dist4 = Math.hypot(rect.width - x, rect.height - y);
            const scale = Math.max(dist1, dist2, dist3, dist4);

            const ripples = ensureRipples(button);

            const ripple = document.createElement("span");
            ripple.style.position = "absolute";
            ripple.style.left = `${x - 1}px`;
            ripple.style.top = `${y - 1}px`;
            ripple.style.width = "2px";
            ripple.style.height = "2px";
            ripple.style.borderRadius = "100%";
            ripple.style.background = rippleBaseColor;
            ripple.style.opacity = "1";
            ripple.style.transform = "scale(1)";
            ripple.style.transition = "all 0.5s cubic-bezier(0,.5,0,1)";

            ripples.appendChild(ripple);

            window.setTimeout(() => {
                ripple.style.transform = `scale(${scale})`;
            }, 1);

            window.setTimeout(() => {
                ripple.style.transition = "all 1s ease";
                ripple.style.opacity = "0";
            }, 1000);

            window.setTimeout(() => {
                ripple.remove();
            }, 2000);

            onClick?.(e);
        },
        [onClick, ensureRipples],
    );

    return <button ref={buttonRef} className={`relative inline-flex min-h-10 items-center justify-center gap-2 overflow-clip rounded-full px-5 font-semibold transition-[background] duration-100 ease-linear select-none ${variantClasses[variant]} ${className}`} type={type} onClick={handleClick} {...props} />;
}
