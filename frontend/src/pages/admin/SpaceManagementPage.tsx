import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { ZoneResponse, SpaceResponse, SpaceStatus } from '../../types';
import { getZone } from '../../api/zones';
import { listSpaces, addSpace, updateSpaceStatus } from '../../api/spaces';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

const SPACE_STATUSES: SpaceStatus[] = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE'];

export default function SpaceManagementPage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const safeZoneId = zoneId ?? '';

  const [zone, setZone] = useState<ZoneResponse | null>(null);
  const [spaces, setSpaces] = useState<SpaceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add space form state
  const [spaceNumber, setSpaceNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [addingSpace, setAddingSpace] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [zoneData, spacesData] = await Promise.all([
        getZone(safeZoneId),
        listSpaces(safeZoneId),
      ]);
      setZone(zoneData);
      setSpaces(spacesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load space data');
    } finally {
      setLoading(false);
    }
  }, [safeZoneId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAddSpace(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);

    if (!spaceNumber.trim()) {
      setAddError('Space number is required.');
      return;
    }

    try {
      setAddingSpace(true);
      await addSpace(safeZoneId, {
        spaceNumber: spaceNumber.trim(),
        ...(floor.trim() ? { floor: parseInt(floor, 10) } : {}),
      });
      setSpaceNumber('');
      setFloor('');
      await fetchData();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add space');
    } finally {
      setAddingSpace(false);
    }
  }

  async function handleStatusChange(spaceId: string, newStatus: SpaceStatus) {
    try {
      await updateSpaceStatus(safeZoneId, spaceId, { status: newStatus });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update space status');
    }
  }

  if (loading) return <LoadingSpinner />;

  if (error && !zone) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/zones')}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Zones
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        Manage Spaces &mdash; {zone?.name}
      </h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Add Space Form */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Add New Space</h2>
        {addError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{addError}</div>
        )}
        <form onSubmit={handleAddSpace} className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="spaceNumber" className="block text-sm font-medium text-gray-700">
              Space Number
            </label>
            <input
              id="spaceNumber"
              type="text"
              value={spaceNumber}
              onChange={(e) => setSpaceNumber(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="A-101"
              required
            />
          </div>
          <div className="w-32">
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
              Floor
            </label>
            <input
              id="floor"
              type="number"
              step="1"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="1"
            />
          </div>
          <button
            type="submit"
            disabled={addingSpace}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {addingSpace ? 'Adding...' : 'Add Space'}
          </button>
        </form>
      </div>

      {/* Spaces Table */}
      {spaces.length === 0 ? (
        <EmptyState message="No spaces in this zone. Add a space using the form above." />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Space Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Floor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {spaces.map((space) => (
                  <tr key={space.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {space.spaceNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {space.floor != null ? space.floor : '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={space.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <select
                        value={space.status}
                        onChange={(e) => handleStatusChange(space.id, e.target.value as SpaceStatus)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {SPACE_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
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
