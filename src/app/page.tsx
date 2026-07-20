import { IconSearch } from "@tabler/icons-react";

import { AppNavigation, MobileNavigation } from "@/components/AppNavigation";
import { InitialSetupForm } from "@/components/InitialSetupForm";
import { NoteCard } from "@/components/NoteCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

const isSignedIn = true;

const notes = [
    {
        actor: "Alice",
        color: "accent" as const,
        handle: "@alice@example.social",
        reactions: [
            { emoji: "🌿", count: 8, name: "herb", reacted: true },
            { emoji: "✨", count: 4, name: "sparkles" },
        ],
        text: "Salviaへようこそ！\nシンプルで心地よいタイムラインを作っていきます。",
        time: "2分",
    },
    {
        actor: "Mika",
        color: "warm" as const,
        handle: "@mika@remote.example",
        reactions: [
            { emoji: "🌱", count: 12, name: "seedling" },
            { emoji: "💛", count: 5, name: "yellow_heart" },
        ],
        text: "今日は庭のハーブを植え替えました 🌿",
        time: "18分",
    },
    {
        actor: "Sora",
        color: "cool" as const,
        handle: "@sora@example.social",
        reactions: [{ emoji: "💡", count: 3, name: "bulb" }],
        text: "小さくて速い道具は、使うたびに嬉しくなる。",
        time: "1時間",
    },
];

export default function Home() {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-295">
            {isSignedIn ? (
                <>
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
                    <MobileNavigation />{" "}
                </>
            ) : (
                <main className="flex min-w-0 flex-1 items-center justify-center pb-20 lg:pb-0">
                    {/* ここにたどり着くということは、初回セットアップ画面 */}
                    <InitialSetupForm />
                </main>
            )}
        </div>
    );
}
