import { useAuth } from '../../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {user?.firstName} {user?.lastName}
        </span>
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
          {user?.role}
        </span>
      </div>
      <button
        onClick={logout}
        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
      >
        Logout
      </button>
    </header>
  );
}
