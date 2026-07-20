"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { IconArrowRight, IconCircleCheck, IconKey, IconShieldCheck, IconSparkles, IconUser } from "@tabler/icons-react";

import { Button } from "@/components/ui/Button";

type Step = "username" | "passkey";
type StepDirection = "forward" | "backward";
type StepState = "done" | "current" | "pending";

const enterClass = "transition-[transform,opacity] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const enterClassUp = "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const enterClassPop = "transition-[transform,opacity] duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

export function InitialSetupForm() {
    const [username, setUsername] = useState("");
    const [step, setStep] = useState<Step>("username");
    const [direction, setDirection] = useState<StepDirection>("forward");
    const [hasInteracted, setHasInteracted] = useState(false);
    const usernameInputRef = useRef<HTMLInputElement | null>(null);

    const trimmed = username.trim();
    const canContinue = trimmed.length > 0;

    useLayoutEffect(() => {
        if (step === "username") {
            usernameInputRef.current?.focus();
        }
    }, [step]);

    const goToPasskey = () => {
        if (!canContinue) {
            return;
        }
        setDirection("forward");
        setHasInteracted(true);
        setStep("passkey");
    };

    const goBack = () => {
        setDirection("backward");
        setHasInteracted(true);
        setStep("username");
    };

    return (
        <FadeInUp>
            <header className="mb-8 flex flex-col items-center text-center">
                <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-accent-ink shadow-lg shadow-accent/20">
                    <IconSparkles className="size-7" />
                </span>
                <h1 className="font-bold text-2xl tracking-tight">Salviaへようこそ</h1>
                <p className="mt-2 text-muted text-sm leading-relaxed">
                    Rosmarinusのための
                    <br className="hidden sm:block" />
                    シンプルなソーシャルクライアント
                </p>
            </header>

            <section className="w-full rounded-3xl border border-divider bg-panel p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
                        <IconShieldCheck className="size-5" />
                    </span>
                    <div className="min-w-0">
                        <h2 className="font-bold text-base">初期セットアップ</h2>
                        <p className="text-muted text-xs">最初の管理者アカウントを作成します</p>
                    </div>
                </div>

                <ol className="mb-6 space-y-3">
                    <StepItem key={`1-${step}`} label="ユーザー名を決める" number={1} state={step === "passkey" ? "done" : "current"} />
                    <StepItem key={`2-${step}`} label="パスキーを登録する" number={2} state={step === "passkey" ? "current" : "pending"} />
                </ol>

                <SlideIn animate={hasInteracted} direction={direction} stepKey={step}>
                    {step === "username" ? (
                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                goToPasskey();
                            }}
                        >
                            <label className="block">
                                <span className="mb-1.5 block font-semibold text-sm">ユーザー名</span>
                                <div className="flex items-center rounded-2xl border border-divider bg-background/70 transition focus-within:border-accent focus-within:bg-panel-highlight">
                                    <span className="grid size-11 shrink-0 place-items-center text-muted">
                                        <IconUser className="size-5" />
                                    </span>
                                    <input aria-label="ユーザー名" autoComplete="username" className="min-w-0 flex-1 bg-transparent py-2 pr-4 text-sm outline-none placeholder:text-muted/70" onChange={(event) => setUsername(event.target.value)} placeholder="admin" ref={usernameInputRef} type="text" value={username} />
                                </div>
                                <span className="mt-1.5 block text-muted text-xs">あとから変更できません</span>
                            </label>
                            <Button className="w-full" disabled={!canContinue} type="submit">
                                次へ
                                <IconArrowRight className="size-5" />
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-divider bg-background/70 p-4">
                                <p className="text-muted text-xs">ユーザー名</p>
                                <p className="mt-1 font-bold">@{trimmed}</p>
                            </div>
                            <Button className="w-full" type="button">
                                <IconKey className="size-5" />
                                パスキーを登録
                            </Button>
                            <button className="block w-full text-center text-muted text-sm transition-transform transition-colors duration-150 hover:text-foreground active:scale-[0.97] motion-reduce:transition-none" onClick={goBack} type="button">
                                戻る
                            </button>
                        </div>
                    )}
                </SlideIn>
            </section>

            <p className="mt-6 text-center text-muted text-xs leading-relaxed">©2026 nexryai All rights reserved.</p>
        </FadeInUp>
    );
}

function FadeInUp({ children }: { children: React.ReactNode }) {
    const [shown, setShown] = useState(false);

    useLayoutEffect(() => {
        setShown(true);
    }, []);

    return <div className={`mx-auto flex w-full max-w-md flex-col items-center px-5 py-12 sm:py-16 ${enterClassUp} ${shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>{children}</div>;
}

function SlideIn({ animate, children, direction, stepKey }: { animate: boolean; children: React.ReactNode; direction: StepDirection; stepKey: Step }) {
    const [shown, setShown] = useState(!animate);
    const shouldAnimateRef = useRef(animate);

    useLayoutEffect(() => {
        if (shouldAnimateRef.current) {
            setShown(true);
        }
    }, []);

    const hiddenTranslate = direction === "forward" ? "translate-x-5" : "-translate-x-5";

    return (
        <div className={`${enterClass} ${shown ? "translate-x-0 scale-100 opacity-100" : `${hiddenTranslate} scale-[0.98] opacity-0`}`} key={stepKey}>
            {children}
        </div>
    );
}

function PopIn({ children }: { children: React.ReactNode }) {
    const [stage, setStage] = useState<"hidden" | "overshoot" | "settled">("hidden");

    useLayoutEffect(() => {
        setStage("overshoot");
        const id = setTimeout(() => setStage("settled"), 200);
        return () => clearTimeout(id);
    }, []);

    const className = stage === "hidden" ? "scale-50 opacity-0" : stage === "overshoot" ? "scale-[1.2] opacity-100" : "scale-100 opacity-100";

    return <span className={`inline-flex ${enterClassPop} ${className}`}>{children}</span>;
}

function StepItem({ label, number, state }: { label: string; number: number; state: StepState }) {
    return (
        <li className="flex items-center gap-3">
            <StepBadge number={number} state={state} />
            <span className={`text-sm transition-colors duration-300 ${state === "pending" ? "text-muted" : "text-foreground font-semibold"}`}>{label}</span>
        </li>
    );
}

function StepBadge({ number, state }: { number: number; state: StepState }) {
    if (state === "done") {
        return (
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink ring-2 ring-accent-soft transition-[box-shadow,background-color] duration-300">
                <PopIn>
                    <IconCircleCheck className="size-4" />
                </PopIn>
            </span>
        );
    }
    if (state === "current") {
        return <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent-strong text-xs transition-colors duration-300">{number}</span>;
    }
    return <span className="grid size-6 shrink-0 place-items-center rounded-full border border-divider bg-background/70 font-semibold text-muted text-xs transition-colors duration-300">{number}</span>;
}
