import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { listReservations } from '../../api/reservations';
import { listSessions } from '../../api/sessions';
import { listInvoices } from '../../api/billing';
import { listZones } from '../../api/zones';
import type {
  ReservationResponse,
  SessionResponse,
  InvoiceResponse,
  ZoneResponse,
} from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      listSessions(user.userId, 'ACTIVE'),
      listReservations(user.userId),
      listInvoices(user.userId),
      listZones(),
    ])
      .then(([s, r, i, z]) => {
        setSessions(s);
        setReservations(r);
        setInvoices(i);
        setZones(z);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const activeSessions = sessions.length;
  const activeReservations = reservations.filter(
    (r) => r.status === 'ACTIVE',
  ).length;
  const pendingInvoices = invoices.filter(
    (i) => i.status === 'PENDING',
  ).length;
  const availableZones = zones.length;

  const cards = [
    {
      label: 'Active Sessions',
      value: activeSessions,
      to: '/my/sessions',
      bgColor: 'bg-green-500',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Active Reservations',
      value: activeReservations,
      to: '/my/reservations',
      bgColor: 'bg-blue-500',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Invoices',
      value: pendingInvoices,
      to: '/my/invoices',
      bgColor: 'bg-yellow-500',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
    },
    {
      label: 'Available Zones',
      value: availableZones,
      to: '/zones',
      bgColor: 'bg-indigo-500',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.firstName}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-lg p-3 ${card.bgColor}`}
                >
                  {card.icon}
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/zones"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Parking
          </Link>
          <Link
            to="/zones"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reserve Space
          </Link>
          <Link
            to="/zones"
            className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Browse Zones
          </Link>
        </div>
      </div>
    </div>
  );
}
