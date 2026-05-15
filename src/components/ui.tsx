import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
};

const buttonStyles = {
  primary:
    "bg-[var(--color-ink)] text-white shadow-sm hover:bg-[var(--color-ink-soft)]",
  secondary:
    "bg-white text-[var(--color-ink)] ring-1 ring-[var(--color-border)] hover:bg-[var(--color-panel)]",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-panel)]",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
};

export function Button({
  children,
  className,
  href,
  type = "button",
  variant = "primary",
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
    buttonStyles[variant],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">{description}</p>
      ) : null}
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "pro" | "warn";
}) {
  const classes = {
    default: "bg-[var(--color-panel)] text-[var(--color-muted)]",
    pro: "bg-[var(--color-highlight)] text-[var(--color-ink)]",
    warn: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  };

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", classes[tone])}>
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed bg-[var(--color-panel)]/40 text-center">
      <div className="space-y-3 py-8">
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
        <p className="mx-auto max-w-lg text-sm leading-7 text-[var(--color-muted)]">
          {description}
        </p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Card>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

const inputClassName =
  "h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClassName, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]",
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]",
        props.className,
      )}
    />
  );
}

export function Banner({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn" | "success";
  children: ReactNode;
}) {
  const classes = {
    info: "border-[var(--color-border)] bg-white text-[var(--color-ink)]",
    warn: "border-[var(--color-danger-soft)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
    success: "border-[var(--color-highlight)] bg-[var(--color-highlight)] text-[var(--color-ink)]",
  };

  return (
    <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", classes[tone])}>
      {children}
    </div>
  );
}
