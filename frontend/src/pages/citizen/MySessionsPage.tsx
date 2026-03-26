import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listSessions, stopSession } from '../../api/sessions';
import type { SessionResponse } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

function formatDuration(startTime: string, endTime: string | null): string {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const diffMs = end - start;
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function MySessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [stoppingId, setStoppingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listSessions(user.userId)
      .then(setSessions)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleStop(id: string) {
    setStoppingId(id);
    setError(null);
    try {
      const updated = await stopSession(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? updated : s)),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to stop session');
      }
    } finally {
      setStoppingId(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  const activeSessions = sessions.filter((s) => s.status === 'ACTIVE');
  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
        <EmptyState message="No parking sessions yet" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Active Sessions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Active Sessions ({activeSessions.length})
        </h2>
        {activeSessions.length === 0 ? (
          <p className="text-sm text-gray-500">No active sessions.</p>
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
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Duration
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
                  {activeSessions.map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {s.zoneId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {s.spaceId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {s.vehicleId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(s.startTime).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {s.durationMinutes != null ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m` : formatDuration(s.startTime, s.endTime)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button
                          onClick={() => handleStop(s.id)}
                          disabled={stoppingId === s.id}
                          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                        >
                          {stoppingId === s.id ? 'Stopping...' : 'Stop'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Completed Sessions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Completed Sessions ({completedSessions.length})
        </h2>
        {completedSessions.length === 0 ? (
          <p className="text-sm text-gray-500">No completed sessions.</p>
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
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Ended
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {completedSessions.map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {s.zoneId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {s.spaceId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {s.vehicleId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(s.startTime).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {s.endTime
                          ? new Date(s.endTime).toLocaleString()
                          : '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {s.durationMinutes != null ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m` : formatDuration(s.startTime, s.endTime)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
