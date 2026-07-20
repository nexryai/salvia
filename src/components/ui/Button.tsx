"use client";

import { type ButtonHTMLAttributes, type MouseEvent, useCallback, useRef } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "link";
    disableRipple?: boolean;
};

const variantClasses = {
    primary: "bg-accent text-accent-ink hover:bg-accent-strong active:bg-accent-strong",
    secondary: "bg-accent-soft text-accent-strong hover:bg-accent-soft-hover active:bg-accent-soft-hover",
    ghost: "text-muted hover:bg-panel-highlight hover:text-foreground active:bg-panel-highlight",
    link: "min-h-0 rounded-none px-0 font-normal text-muted hover:text-foreground",
};

const rippleShadowRest = "rgba(0, 0, 0, 0.1)";

export function Button({ className = "", disableRipple = false, type = "button", variant = "primary", onMouseDown, ...props }: ButtonProps) {
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

    const handleMouseDown = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            if (disableRipple) {
                onMouseDown?.(e);
                return;
            }
            const button = buttonRef.current;
            if (!button) {
                onMouseDown?.(e);
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
            ripple.style.background = "transparent";
            ripple.style.boxShadow = `0 0 0 0 ${rippleShadowRest}`;
            ripple.style.transform = "scale(1)";
            ripple.style.transition = "all 0.5s cubic-bezier(0,.5,0,1)";

            ripples.appendChild(ripple);

            window.setTimeout(() => {
                ripple.style.boxShadow = `0 0 0 ${scale}px transparent`;
            }, 1);

            window.setTimeout(() => {
                ripple.remove();
            }, 500);

            onMouseDown?.(e);
        },
        [disableRipple, onMouseDown, ensureRipples],
    );

    return (
        <button ref={buttonRef} className={`relative inline-flex min-h-10 items-center justify-center gap-2 overflow-clip rounded-full px-5 font-semibold transition-[background] duration-100 ease-linear select-none ${variantClasses[variant]} ${className}`} type={type} onMouseDown={handleMouseDown} {...props}>
            <span className="relative z-[1] pointer-events-none inline-flex items-center justify-center gap-2">{props.children}</span>
        </button>
    );
}
