import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ExplorerPage from "./pages/ExplorerPage";
import StatusPage from "./pages/StatusPage";
import MetricsPage from "./pages/MetricsPage";
import RequireAuth from "./auth/RequireAuth";
import AppLayout from "./layout/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ExplorerPage />} />
          <Route path="status" element={<StatusPage />} />
          <Route path="metrics" element={<MetricsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
