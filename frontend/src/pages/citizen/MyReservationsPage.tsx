import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listReservations, cancelReservation } from '../../api/reservations';
import type { ReservationResponse } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

export default function MyReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listReservations(user.userId)
      .then(setReservations)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleCancel(id: string) {
    setCancellingId(id);
    setError(null);
    try {
      const updated = await cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? updated : r)),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to cancel reservation');
      }
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <EmptyState message="No reservations yet" />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Space
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {r.zoneId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {r.spaceId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {r.vehicleId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(r.startTime).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(r.endTime).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {r.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={cancellingId === r.id}
                          className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {cancellingId === r.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
