import { Link, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  to: string;
}

const citizenLinks: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Browse Zones', to: '/zones' },
  { label: 'My Vehicles', to: '/my/vehicles' },
  { label: 'My Reservations', to: '/my/reservations' },
  { label: 'My Sessions', to: '/my/sessions' },
  { label: 'My Invoices', to: '/my/invoices' },
  { label: 'Profile', to: '/profile' },
];

const adminLinks: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Manage Zones', to: '/admin/zones' },
  { label: 'Profile', to: '/profile' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <nav className="flex h-full flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-5">
        <span className="text-lg font-bold tracking-wide">Parking Mgmt</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <ul className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive =
            location.pathname === link.to ||
            (link.to !== '/dashboard' && location.pathname.startsWith(link.to));

          return (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={onClose}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
