import { IconSearch } from "@tabler/icons-react";

import { AppNavigation, MobileNavigation } from "@/components/app-navigation";
import { NoteCard } from "@/components/note-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const notes = [
    {
        actor: "Alice",
        color: "accent" as const,
        handle: "@alice@example.social",
        text: "Salviaへようこそ！\nシンプルで心地よいタイムラインを作っていきます。",
        time: "2分",
    },
    {
        actor: "Mika",
        color: "warm" as const,
        handle: "@mika@remote.example",
        text: "今日は庭のハーブを植え替えました 🌿",
        time: "18分",
    },
    {
        actor: "Sora",
        color: "cool" as const,
        handle: "@sora@example.social",
        text: "小さくて速い道具は、使うたびに嬉しくなる。",
        time: "1時間",
    },
];

export default function Home() {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-[1180px]">
            <AppNavigation />
            <main className="min-w-0 flex-1 pb-20 lg:pb-0">
                <header className="sticky top-0 z-10 flex h-16 items-center border-divider border-b bg-background/85 px-5 backdrop-blur-xl sm:px-6">
                    <div>
                        <h1 className="font-bold text-lg">タイムライン</h1>
                        <p className="text-muted text-xs">ホーム</p>
                    </div>
                    <button aria-label="検索" className="ml-auto rounded-full p-2 text-muted transition hover:bg-panel-highlight hover:text-foreground" type="button">
                        <IconSearch className="size-5" />
                    </button>
                </header>
                <section aria-label="ノート作成" className="border-divider border-b bg-panel p-5 sm:p-6">
                    <div className="flex gap-3">
                        <Avatar name="Alice" />
                        <div className="min-w-0 flex-1">
                            <p className="pt-2 text-muted">いまどうしてる？</p>
                            <div className="mt-5 flex items-center justify-between border-divider border-t pt-4">
                                <span className="text-muted text-xs">Actor: @alice</span>
                                <Button className="min-h-9 px-5 py-1 text-sm">ノート</Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section aria-label="ノート一覧" className="bg-panel">
                    {notes.map((note) => (
                        <NoteCard {...note} key={note.handle} />
                    ))}
                </section>
            </main>
            <aside className="hidden w-80 shrink-0 border-divider border-l px-6 py-6 xl:block">
                <section className="rounded-2xl border border-divider bg-panel p-5 shadow-sm">
                    <h2 className="font-bold">現在のActor</h2>
                    <div className="mt-4 flex items-center gap-3">
                        <Avatar name="Alice" size="lg" />
                        <div className="min-w-0">
                            <p className="truncate font-bold">Alice</p>
                            <p className="truncate text-muted text-sm">@alice@example.social</p>
                        </div>
                    </div>
                    <Button className="mt-4 w-full" variant="secondary">
                        Actorを切り替える
                    </Button>
                </section>
                <section className="mt-5 rounded-2xl border border-divider bg-panel p-5 shadow-sm">
                    <h2 className="font-bold">Salviaについて</h2>
                    <p className="mt-2 text-muted text-sm leading-6">Rosmarinusとつながる、軽量でシンプルなソーシャルクライアントです。</p>
                </section>
            </aside>
            <MobileNavigation />
        </div>
    );
}
