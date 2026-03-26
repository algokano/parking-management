import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { ZoneResponse } from '../../types';
import { listZones } from '../../api/zones';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

export default function ZoneManagementPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchZones() {
      try {
        setLoading(true);
        const data = await listZones();
        setZones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load zones');
      } finally {
        setLoading(false);
      }
    }
    fetchZones();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Zone Management</h1>
        <button
          onClick={() => navigate('/admin/zones/new')}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Zone
        </button>
      </div>

      {zones.length === 0 ? (
        <EmptyState message="No zones found. Get started by adding your first parking zone." />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hourly Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total Spaces</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{zone.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{zone.address}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{zone.zoneType}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">${zone.hourlyRate.toFixed(2)}/hr</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{zone.totalSpaces}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admin/zones/${zone.id}/edit`)}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/admin/zones/${zone.id}/spaces`)}
                          className="font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Manage Spaces
                        </button>
                      </div>
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
