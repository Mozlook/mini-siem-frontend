import { useMemo, useState } from "react";

type Props = {
  title: string;
  value: unknown;
};

function toPrettyText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") {
    try {
      const obj = JSON.parse(value);
      return JSON.stringify(obj, null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function JsonCard({ title, value }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const text = useMemo(() => toPrettyText(value), [value]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1200);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1200);
    }
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/30">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2">
        <div className="text-sm font-semibold text-slate-200">{title}</div>

        <div className="flex items-center gap-3">
          {copyState === "copied" ? (
            <span className="text-xs text-slate-400">Copied.</span>
          ) : copyState === "failed" ? (
            <span className="text-xs text-slate-400">Copy failed.</span>
          ) : null}

          <button
            type="button"
            onClick={onCopy}
            disabled={!text}
            className="inline-flex items-center rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="max-h-105 overflow-auto p-3">
        {!text ? (
          <div className="text-sm text-slate-400">Empty.</div>
        ) : (
          <pre className="text-xs leading-5 text-slate-200">
            <code>{text}</code>
          </pre>
        )}
      </div>
    </section>
  );
}
