// console-line-ui primitives for React. Pair with console-line.css; no other dependencies.
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

// Time ------------------------------------------------------------------------------

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function relative(iso: string | null | undefined): string {
  if (!iso) return "never";
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const abs = Math.abs(seconds);
  if (abs < 45) return seconds < 0 ? "just now" : "in a moment";
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  return rtf.format(Math.round(seconds / 86400), "day");
}

export function absolute(iso: string | null | undefined): string {
  return iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" }) : "—";
}

/** Relative time, with the absolute one on hover. */
export function Time({ value }: { value: string | null | undefined }) {
  return (
    <time dateTime={value ?? undefined} title={absolute(value)}>
      {relative(value)}
    </time>
  );
}

/** snake_case enum to sentence case: "require_approval" → "Require approval". */
export const sentence = (value: string) => (value ? value[0].toUpperCase() + value.slice(1).replace(/_/g, " ") : "");

// Signals ---------------------------------------------------------------------------

export type Signal = "ok" | "warn" | "danger" | "idle";

/** A signal lamp. Always says its state in words for assistive tech and on hover. */
export function Lamp({ signal, label }: { signal: Signal; label: string }) {
  return <span className={`lamp lamp--${signal}`} role="img" aria-label={label} title={label} />;
}

/** Map your domain states to signals here, not in CSS. */
export const STATE_SIGNAL: Record<string, Signal> = {
  active: "ok", running: "ok", approved: "ok", executed: "ok", completed: "ok", claimed: "ok", allowed: "ok",
  pending: "warn", requested: "warn", paused: "warn", suspended: "warn",
  failed: "danger", revoked: "danger", rejected: "danger",
};

export function Badge({ state, signal, children }: { state?: string; signal?: Signal; children?: ReactNode }) {
  const s = signal ?? (state ? STATE_SIGNAL[state] : undefined);
  return <span className={`badge${s && s !== "idle" ? ` badge--${s}` : ""}`}>{children ?? sentence(state ?? "")}</span>;
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="mono">{children}</code>;
}

// Layout ----------------------------------------------------------------------------

export function PageHeader({ title, lede, crumb, children }: {
  title: ReactNode; lede?: ReactNode; crumb?: ReactNode; children?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {crumb && <p className="crumbs">{crumb}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}

export function Tally({ value, label, tone }: { value: number; label: string; tone?: "warn" | "danger" }) {
  // Colour only a non-zero bad number; zero is always ink.
  const t = value ? tone : undefined;
  return (
    <div className={`tally${t ? ` tally--${t}` : ""}`}>
      <span className="tally-value">{value ?? 0}</span>
      <span className="tally-label">{label}</span>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null;
  const message = error instanceof Error ? error.message : String(error);
  return (
    <p className="error-note" role="alert">
      {message}
    </p>
  );
}

// Forms -----------------------------------------------------------------------------

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Check({ label, hint, checked, onChange, disabled }: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="check">
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <label htmlFor={id}>
        {label}
        {hint && <span className="hint">{hint}</span>}
      </label>
    </div>
  );
}

// Dialogs ---------------------------------------------------------------------------

export function Dialog({ title, open, onClose, children, tone }: {
  title: string; open: boolean; onClose: () => void; children: ReactNode; tone?: "danger";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`dialog${tone ? ` dialog--${tone}` : ""}`} onClose={onClose} aria-label={title}>
      {open && (
        <>
          <header className="dialog-header">
            <h2>{title}</h2>
            <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
              ×
            </button>
          </header>
          <div className="dialog-body">{children}</div>
        </>
      )}
    </dialog>
  );
}

/** A dialog that asks for a reason before running an action that changes someone else's world. */
export function ReasonDialog({ title, open, onClose, onConfirm, confirmLabel, tone, confirmName, children }: {
  title: string; open: boolean; onClose: () => void; onConfirm: (reason: string) => Promise<unknown>;
  confirmLabel: string; tone?: "danger";
  /** When set, the user must type this exactly before the action arms: for irreversible actions. */
  confirmName?: string;
  children?: ReactNode;
}) {
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) { setReason(""); setTyped(""); setError(null); }
  }, [open]);
  const armed = reason.trim().length >= 3 && (!confirmName || typed === confirmName);
  return (
    <Dialog title={title} open={open} onClose={onClose} tone={tone}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await onConfirm(reason);
            onClose();
          } catch (err) {
            setError(err);
          } finally {
            setBusy(false);
          }
        }}
      >
        {children}
        <Field label="Reason" hint="Recorded in the audit log.">
          {(id) => <textarea id={id} value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required minLength={3} />}
        </Field>
        {confirmName && (
          <Field label={`Type ${confirmName} to confirm`}>
            {(id) => <input id={id} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />}
          </Field>
        )}
        <ErrorNote error={error} />
        <div className="dialog-actions">
          <button type="button" className="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={`button ${tone === "danger" ? "button--danger" : "button--primary"}`} disabled={!armed || busy}>
            {confirmLabel}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/** The guarded switch for irreversible, high-blast-radius actions. At most one per screen. */
export function KillSwitch({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="kill-switch" onClick={onClick}>
      <span className="kill-switch-guard" aria-hidden="true" />
      {children}
    </button>
  );
}

/** Theme: "system" removes the attribute; light/dark force it. */
export function useTheme(): ["system" | "light" | "dark", (t: "system" | "light" | "dark") => void] {
  const read = () => {
    try { return (localStorage.getItem("theme") as "light" | "dark" | null) ?? "system"; } catch { return "system"; }
  };
  const [theme, setTheme] = useState<"system" | "light" | "dark">(read);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try { theme === "system" ? localStorage.removeItem("theme") : localStorage.setItem("theme", theme); } catch { /* storage blocked */ }
  }, [theme]);
  return [theme, setTheme];
}
