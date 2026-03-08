import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  defaultExplorerFilters,
  filtersFromUrlSearchParams,
  filtersToUrlSearchParams,
  normalizeExplorerFilters,
  type ExplorerFilters,
} from "./filters";

type CopyState = "idle" | "copied" | "failed";

export function useExplorerState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [draft, setDraft] = useState<ExplorerFilters>(() =>
    filtersFromUrlSearchParams(searchParams),
  );
  const [applied, setApplied] = useState<ExplorerFilters>(() =>
    filtersFromUrlSearchParams(searchParams),
  );

  const spKey = searchParams.toString();
  useEffect(() => {
    const parsed = filtersFromUrlSearchParams(searchParams);
    setDraft(parsed);
    setApplied(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(normalizeExplorerFilters(applied));
    const d = JSON.stringify(normalizeExplorerFilters(draft));
    return a !== d;
  }, [applied, draft]);

  const [copyState, setCopyState] = useState<CopyState>("idle");

  const apply = () => {
    const normalized = normalizeExplorerFilters(draft);
    setApplied(normalized);
    setSearchParams(filtersToUrlSearchParams(normalized));
    setCopyState("idle");
  };

  const reset = () => {
    const def = defaultExplorerFilters();
    setDraft(def);
    setApplied(def);
    setSearchParams(new URLSearchParams());
    setCopyState("idle");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1500);
    }
  };

  return {
    draft,
    setDraft,
    applied,
    apply,
    reset,
    copyLink,
    copyState,
    isDirty,
  };
}
