export const AUTH_LOGOUT_EVENT = "mini-siem:logout";

export function emitLogout(reason?: string) {
  window.dispatchEvent(
    new CustomEvent(AUTH_LOGOUT_EVENT, { detail: { reason } }),
  );
}

export function subscribeLogout(handler: (reason?: string) => void) {
  const listener = (e: Event) => {
    const ce = e as CustomEvent<{ reason?: string }>;
    handler(ce.detail?.reason);
  };

  window.addEventListener(AUTH_LOGOUT_EVENT, listener);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, listener);
}
