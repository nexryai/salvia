import Link from "next/link";

import { IconBell, IconChevronRight, IconHome, IconPlus, IconSettings, IconSparkles, IconUser } from "@tabler/icons-react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

const items = [
    { href: "/", icon: IconHome, label: "タイムライン" },
    { href: "/notifications", icon: IconBell, label: "通知" },
    { href: "/actors", icon: IconUser, label: "アクター" },
    { href: "/settings", icon: IconSettings, label: "設定" },
];

export function AppNavigation() {
    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-divider border-r bg-nav px-5 py-6 lg:flex lg:flex-col">
            <Link className="mb-8 flex items-center gap-3 px-3 font-bold text-xl tracking-tight" href="/">
                <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-accent-ink shadow-lg shadow-accent/20">
                    <IconSparkles className="size-5" />
                </span>
                Salvia
            </Link>
            <nav aria-label="メインナビゲーション" className="space-y-1">
                {items.map((item, index) => {
                    const ItemIcon = item.icon;
                    return (
                        <Link className={`flex items-center gap-4 rounded-xl px-4 py-3 font-semibold transition ${index === 0 ? "bg-accent-soft text-accent-strong" : "text-muted hover:bg-panel-highlight hover:text-foreground"}`} href={item.href} key={item.href}>
                            <ItemIcon className="size-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <Button className="mt-6 w-full">
                <IconPlus className="size-5" />
                ノート
            </Button>
            <button className="mt-auto flex items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-panel-highlight" type="button">
                <Avatar name="A" size="sm" />
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">admin</span>
                    <span className="block truncate text-muted text-xs">Actor: @alice</span>
                </span>
                <IconChevronRight className="size-4 text-muted" />
            </button>
        </aside>
    );
}

export function MobileNavigation() {
    return (
        <nav aria-label="モバイルナビゲーション" className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-around border-divider border-t bg-nav/95 px-2 backdrop-blur lg:hidden">
            {items.slice(0, 3).map((item, index) => {
                const ItemIcon = item.icon;
                return (
                    <Link className={`grid min-w-16 place-items-center gap-0.5 text-[11px] ${index === 0 ? "text-accent-strong" : "text-muted"}`} href={item.href} key={item.href}>
                        <ItemIcon className="size-5" />
                        {item.label}
                    </Link>
                );
            })}
            <Button aria-label="ノートを作成" className="size-11 p-0">
                <IconPlus className="size-5" />
            </Button>
        </nav>
    );
}
