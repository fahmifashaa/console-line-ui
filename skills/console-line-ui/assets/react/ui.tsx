// console-line-ui primitives for React. Pair with console-line.css; no other dependencies.
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

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

// Dot-matrix chart --------------------------------------------------------------------

export type MatrixPoint = { at: string; value: number | null; previous: number | null };

/**
 * A series as columns of cells, filled from the bottom: ink is now, --mark-before the same slot one period
 * earlier. Hover or arrow keys read a column. `formatX(at, exact)` labels the axis (exact: for the cursor).
 */
export function DotMatrix({ points, title, description, format, formatX, rows = 12, labels = 6 }: {
  points: MatrixPoint[]; title: string; description: string;
  format: (v: number) => string; formatX: (at: string, exact: boolean) => string; rows?: number; labels?: number;
}) {
  const id = useId();
  const plot = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(0, ...points.flatMap((p) => [p.value ?? 0, p.previous ?? 0]));
  const scale = max || 1;
  const n = points.length;
  // Any value above zero shows at least one cell, so a single failure never disappears.
  const cells = (v: number | null) => (v && v > 0 ? Math.max(1, Math.round((v / scale) * rows)) : 0);
  const ticks = n ? Array.from({ length: labels }, (_, i) => Math.round((i * (n - 1)) / (labels - 1))) : [];

  const pick = (e: PointerEvent<HTMLDivElement>) => {
    const box = plot.current?.getBoundingClientRect();
    if (!box || !n) return;
    setActive(Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - box.left) / box.width) * n))));
  };
  const step = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowLeft: (active ?? n) - 1, ArrowRight: (active ?? -1) + 1, Home: 0, End: n - 1 };
    if (!(e.key in moves) || !n) return;
    e.preventDefault();
    setActive(Math.min(n - 1, Math.max(0, moves[e.key])));
  };

  const point = active === null ? null : points[active];
  const left = active === null ? 0 : ((active + 0.5) / n) * 100;
  const top = point ? (1 - cells(point.value) / rows) * 100 : 100;
  const show = (v: number | null) => (v === null ? "—" : format(v));

  return (
    <figure className="matrix" style={{ "--matrix-rows": rows } as CSSProperties}>
      <div className="matrix-y" aria-hidden="true">
        <span>{max ? format(max) : ""}</span>
        <span>{max ? format(max / 2) : ""}</span>
        <span>0</span>
      </div>
      <div className="matrix-body">
        <div ref={plot} className="matrix-plot" role="img" tabIndex={0} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}
          onPointerMove={pick} onPointerLeave={() => setActive(null)} onKeyDown={step} onBlur={() => setActive(null)}
          style={{ "--matrix-cols": n } as CSSProperties}>
          <span id={`${id}-t`} hidden>{title}</span>
          <span id={`${id}-d`} hidden>{description}</span>
          {points.map((p, col) => {
            const now = cells(p.value), before = cells(p.previous);
            return (
              <div key={p.at} className="matrix-col">
                {Array.from({ length: rows }, (_, row) => (
                  <span key={row} style={{ "--c": col, "--r": row } as CSSProperties}
                    className={`matrix-cell${row < now ? " matrix-cell--now" : row < before ? " matrix-cell--before" : ""}`} />
                ))}
              </div>
            );
          })}
          {point && (
            <>
              <span className="matrix-cross" style={{ left: `${left}%` }} aria-hidden="true" />
              <span className="matrix-dot" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden="true" />
              <div className={`matrix-tip${left > 60 ? " matrix-tip--left" : ""}`} style={{ left: `${left}%`, top: `${top}%` }}>
                <span className="matrix-tip-time">{formatX(point.at, true)}</span>
                <strong>{show(point.value)}</strong>
                <span className="matrix-tip-time">previous {show(point.previous)}</span>
              </div>
            </>
          )}
        </div>
        <div className="matrix-x" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={t} style={{ left: `${((t + 0.5) / n) * 100}%` }}
              className={`matrix-x-label${i === 0 ? " matrix-x-label--start" : i === ticks.length - 1 ? " matrix-x-label--end" : i !== Math.floor((ticks.length - 1) / 2) ? " matrix-x-label--minor" : ""}`}>
              {formatX(points[t].at, false)}
            </span>
          ))}
          {point && <span className="matrix-pill" style={{ left: `${left}%` }}>{formatX(point.at, true)}</span>}
        </div>
        <p className="visually-hidden" role="status">
          {point ? `${formatX(point.at, true)}: ${show(point.value)}, previous ${show(point.previous)}` : ""}
        </p>
      </div>
    </figure>
  );
}

export type Kpi = { key: string; label: string; value: string; delta: string; worse?: boolean };

/** A row of figures that choose what the chart above them shows. Colour the delta only when it got worse. */
export function KpiTabs({ items, selected, onSelect, label }: {
  items: Kpi[]; selected: string; onSelect: (key: string) => void; label: string;
}) {
  return (
    <div className="kpis" role="tablist" aria-label={label}>
      {items.map((k) => (
        <button key={k.key} type="button" role="tab" aria-selected={k.key === selected} className="kpi" onClick={() => onSelect(k.key)}>
          <span className="kpi-label">{k.label}</span>
          <span className="kpi-value">{k.value}</span>
          <span className={`kpi-delta${k.worse ? " text-warn" : ""}`}>{k.delta}</span>
        </button>
      ))}
    </div>
  );
}

/** A 4px bar beside a figure in a table cell; `ratio` is value / largest value in the column. */
export function Meter({ ratio, children }: { ratio: number; children: ReactNode }) {
  return (
    <span className="meter-cell">
      {children}
      <span className="meter-track" aria-hidden="true">
        <span className="meter" style={{ width: `${Math.max(0, Math.min(1, ratio)) * 100}%` }} />
      </span>
    </span>
  );
}
