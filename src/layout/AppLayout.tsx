import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-2 py-1 text-sm font-medium transition-colors",
    isActive
      ? "bg-slate-800 text-slate-100"
      : "text-slate-300 hover:bg-slate-900 hover:text-slate-100",
  ].join(" ");

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-4">
          <div className="font-semibold tracking-tight">Mini-SIEM</div>

          <nav className="flex items-center gap-2">
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
                className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
