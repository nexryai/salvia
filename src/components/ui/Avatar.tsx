export type AvatarProps = {
    name: string;
    color?: "accent" | "warm" | "cool";
    size?: "sm" | "md" | "lg";
};

const colorClasses = {
    accent: "from-amber-300 to-yellow-500 text-amber-950",
    warm: "from-orange-300 to-rose-400",
    cool: "from-cyan-300 to-blue-500",
};

const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-11 text-sm",
    lg: "size-14 text-base",
};

export function Avatar({ name, color = "accent", size = "md" }: AvatarProps) {
    return (
        <span aria-label={`${name}のアバター`} className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm ${colorClasses[color]} ${sizeClasses[size]}`} role="img">
            {name.slice(0, 1).toUpperCase()}
        </span>
    );
}
