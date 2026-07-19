import { IconDots } from "@tabler/icons-react";

import { Avatar } from "@/components/ui/avatar";

type NoteCardProps = {
    actor: string;
    color?: "accent" | "warm" | "cool";
    handle: string;
    text: string;
    time: string;
};

export function NoteCard({ actor, color, handle, text, time }: NoteCardProps) {
    return (
        <article className="border-divider border-b p-5 transition hover:bg-panel-highlight/50 sm:p-6">
            <div className="flex gap-3">
                <Avatar color={color} name={actor} />
                <div className="min-w-0 flex-1">
                    <header className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <span className="font-bold">{actor}</span>
                            <span className="ml-2 text-muted text-sm">{handle}</span>
                            <span className="mx-1.5 text-muted">·</span>
                            <time className="text-muted text-sm">{time}</time>
                        </div>
                        <button aria-label="その他の操作" className="rounded-full p-1.5 text-muted transition hover:bg-accent-soft hover:text-accent-strong" type="button">
                            <IconDots className="size-5" />
                        </button>
                    </header>
                    <p className="mt-2 whitespace-pre-line leading-7">{text}</p>
                    <footer className="mt-4 flex max-w-xs items-center justify-between text-muted text-sm">
                        <button className="rounded-full px-2 py-1 transition hover:bg-accent-soft hover:text-accent-strong" type="button">
                            💬 2
                        </button>
                        <button className="rounded-full px-2 py-1 transition hover:bg-accent-soft hover:text-accent-strong" type="button">
                            ♻ 4
                        </button>
                        <button className="rounded-full px-2 py-1 transition hover:bg-accent-soft hover:text-accent-strong" type="button">
                            ⭐ 12
                        </button>
                    </footer>
                </div>
            </div>
        </article>
    );
}
