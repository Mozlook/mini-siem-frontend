import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
        }}
      >
        <strong>Mini‑SIEM</strong>

        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Explorer</Link>
          <Link to="/status">Status</Link>
          <Link to="/metrics">Metrics</Link>
        </nav>

        <div style={{ marginLeft: "auto" }}>
          {isAuthenticated ? (
            <button type="button" onClick={() => logout()}>
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <main style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
