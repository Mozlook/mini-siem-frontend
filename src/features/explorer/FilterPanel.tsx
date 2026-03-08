import type { Dispatch, SetStateAction } from "react";
import { DEFAULT_LIMIT, type ExplorerFilters } from "./filters";

const LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR"] as const;

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((x) => x !== value)
    : [...list, value];
}

type Props = {
  draft: ExplorerFilters;
  setDraft: Dispatch<SetStateAction<ExplorerFilters>>;

  apps: string[];
  appsLoading: boolean;
  appsErrorText: string | null;

  eventTypes: string[];
  eventTypesLoading: boolean;
  eventTypesErrorText: string | null;
};

export default function FiltersPanel(props: Props) {
  const {
    draft,
    setDraft,
    apps,
    appsLoading,
    appsErrorText,
    eventTypes,
    eventTypesLoading,
    eventTypesErrorText,
  } = props;

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-500/20";

  const labelClass = "block text-sm font-medium text-slate-300";

  const cardClass = "rounded-xl border border-slate-800 bg-slate-900/40";

  const onToggleApp = (app: string) => {
    setDraft((s) => {
      const nextApps = toggleValue(s.app, app);
      return { ...s, app: nextApps, event_type: [] };
    });
  };

  return (
    <aside className={`${cardClass} h-fit p-4 lg:sticky lg:top-20`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">Log Explorer</h1>
          <p className="mt-1 text-xs text-slate-400">
            Edit filters on the left. Click Apply to run the query.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Limit:{" "}
          <span className="text-slate-200">{draft.limit || DEFAULT_LIMIT}</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="text-sm font-semibold text-slate-200">Time range</div>
          <div className="mt-2 grid grid-cols-1 gap-3">
            <label>
              <span className={labelClass}>From</span>
              <input
                type="datetime-local"
                value={draft.from}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, from: e.target.value }))
                }
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>To</span>
              <input
                type="datetime-local"
                value={draft.to}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, to: e.target.value }))
                }
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">Apps</div>
            <div className="text-xs text-slate-400">
              {draft.app.length} selected
            </div>
          </div>

          <div className="mt-2 max-h-44 space-y-2 overflow-auto rounded-md border border-slate-800 bg-slate-950/30 p-2">
            {appsLoading ? (
              <div className="text-sm text-slate-400">Loading apps...</div>
            ) : appsErrorText ? (
              <div className="text-sm text-red-200">{appsErrorText}</div>
            ) : apps.length === 0 ? (
              <div className="text-sm text-slate-400">No apps available.</div>
            ) : (
              apps.map((app) => (
                <label
                  key={app}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={draft.app.includes(app)}
                    onChange={() => onToggleApp(app)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950/40"
                  />
                  <span className="text-sm text-slate-200">{app}</span>
                </label>
              ))
            )}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Selecting a single app narrows event types.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">
              Event types
            </div>
            <div className="text-xs text-slate-400">
              {draft.event_type.length} selected
            </div>
          </div>

          <div className="mt-2 max-h-44 space-y-2 overflow-auto rounded-md border border-slate-800 bg-slate-950/30 p-2">
            {eventTypesLoading ? (
              <div className="text-sm text-slate-400">
                Loading event types...
              </div>
            ) : eventTypesErrorText ? (
              <div className="text-sm text-red-200">{eventTypesErrorText}</div>
            ) : eventTypes.length === 0 ? (
              <div className="text-sm text-slate-400">
                No event types available.
              </div>
            ) : (
              eventTypes.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={draft.event_type.includes(t)}
                    onChange={() =>
                      setDraft((s) => ({
                        ...s,
                        event_type: toggleValue(s.event_type, t),
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950/40"
                  />
                  <span className="text-sm text-slate-200">{t}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">Levels</div>
            <div className="text-xs text-slate-400">
              {draft.level.length} selected
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-slate-800 bg-slate-950/30 p-2">
            {LEVELS.map((lvl) => (
              <label
                key={lvl}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={draft.level.includes(lvl)}
                  onChange={() =>
                    setDraft((s) => ({
                      ...s,
                      level: toggleValue(s.level, lvl),
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950/40"
                />
                <span className="text-sm text-slate-200">{lvl}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-200">Fields</div>

          <div className="mt-2 space-y-3">
            <label>
              <span className={labelClass}>User ID</span>
              <input
                value={draft.user_id}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, user_id: e.target.value }))
                }
                placeholder="e.g. user_123"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>Source IP</span>
              <input
                value={draft.src_ip}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, src_ip: e.target.value }))
                }
                placeholder="e.g. 10.0.0.1"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>Request ID</span>
              <input
                value={draft.request_id}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, request_id: e.target.value }))
                }
                placeholder="e.g. req_abc"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>HTTP status</span>
              <input
                inputMode="numeric"
                value={draft.http_status}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, http_status: e.target.value }))
                }
                placeholder="e.g. 401"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>Search</span>
              <input
                value={draft.q}
                onChange={(e) => setDraft((s) => ({ ...s, q: e.target.value }))}
                placeholder="Search in message/path"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>Limit</span>
              <select
                value={draft.limit}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, limit: Number(e.target.value) }))
                }
                className={inputClass}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
