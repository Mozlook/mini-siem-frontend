import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium transition-colors",
    isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900",
  ].join(" ");

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <div className="font-semibold">Mini‑SIEM</div>

          <nav className="flex items-center gap-3">
            <NavLink to="/" className={navLinkClass} end>
              Explorer
            </NavLink>
            <NavLink to="/status" className={navLinkClass}>
              Status
            </NavLink>
            <NavLink to="/metrics" className={navLinkClass}>
              Metrics
            </NavLink>
          </nav>

          <div className="ml-auto">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
