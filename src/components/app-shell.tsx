import Link from "next/link";
import type { ReactNode } from "react";

import { APP_NAV, APP_NAME, QUICK_ACTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  pathname,
  userLabel,
}: {
  children: ReactNode;
  pathname: string;
  userLabel: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-20 mb-6 rounded-[28px] border border-[var(--color-border)] bg-[rgba(250,246,240,0.92)] px-5 py-4 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/app" className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
              {APP_NAME}
            </Link>
            <p className="text-sm text-[var(--color-muted)]">{userLabel}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {APP_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--color-ink)] text-white"
                      : "bg-white text-[var(--color-muted)] ring-1 ring-[var(--color-border)] hover:text-[var(--color-ink)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <div className="fixed inset-x-0 bottom-4 z-20 mx-auto flex max-w-xl justify-center px-4">
        <nav className="grid w-full grid-cols-3 gap-2 rounded-full border border-[var(--color-border)] bg-white/95 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-full bg-[var(--color-ink)] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-ink-soft)]"
            >
              {action.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
