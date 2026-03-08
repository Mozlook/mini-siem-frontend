import { useAuth } from "../auth/AuthContext";

export default function ExplorerPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Explorer</h1>

      {isAuthenticated ? (
        <div className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          Authenticated
        </div>
      ) : null}

      <p className="text-sm text-slate-600">TODO: FE-S3</p>
    </div>
  );
}
