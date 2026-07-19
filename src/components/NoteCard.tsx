import { IconDots } from "@tabler/icons-react";

import { Avatar } from "@/components/ui/Avatar";

type NoteCardProps = {
    actor: string;
    color?: "accent" | "warm" | "cool";
    handle: string;
    text: string;
    time: string;
    reactions?: { emoji: string; count: number; name: string; reacted?: boolean }[];
};

export function NoteCard({ actor, color, handle, reactions = [], text, time }: NoteCardProps) {
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
                    <footer className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        {reactions.map((reaction) => (
                            <button
                                aria-label={`:${reaction.name}: ${reaction.count}件`}
                                aria-pressed={reaction.reacted ?? false}
                                className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 transition ${reaction.reacted ? "border-accent bg-accent-soft text-accent-strong" : "border-divider bg-background/70 text-muted hover:border-accent hover:bg-accent-soft"}`}
                                key={reaction.name}
                                type="button"
                            >
                                <span aria-hidden="true" className="text-lg leading-none">
                                    {reaction.emoji}
                                </span>
                                <span className="font-semibold tabular-nums">{reaction.count}</span>
                            </button>
                        ))}
                        <button aria-label="リアクションを追加" className="grid min-h-8 min-w-8 place-items-center rounded-full border border-divider text-muted transition hover:border-accent hover:bg-accent-soft hover:text-accent-strong" type="button">
                            ＋
                        </button>
                    </footer>
                </div>
            </div>
        </article>
    );
}
