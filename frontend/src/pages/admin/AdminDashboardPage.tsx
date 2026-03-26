import { useState, useEffect } from 'react';
import type { ZoneResponse, OccupancyResponse } from '../../types';
import { listZones, getOccupancy } from '../../api/zones';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ZoneWithOccupancy {
  zone: ZoneResponse;
  occupancy: OccupancyResponse;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<ZoneWithOccupancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const zones = await listZones();
        const results = await Promise.all(
          zones.map(async (zone) => {
            const occupancy = await getOccupancy(zone.id);
            return { zone, occupancy };
          }),
        );
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const totalZones = data.length;
  const totalSpaces = data.reduce((sum, d) => sum + d.occupancy.total, 0);
  const availableSpaces = data.reduce((sum, d) => sum + d.occupancy.available, 0);
  const occupiedSpaces = data.reduce((sum, d) => sum + d.occupancy.occupied, 0);

  const stats = [
    { label: 'Total Zones', value: totalZones, color: 'bg-blue-500' },
    { label: 'Total Spaces', value: totalSpaces, color: 'bg-indigo-500' },
    { label: 'Available Spaces', value: availableSpaces, color: 'bg-green-500' },
    { label: 'Occupied Spaces', value: occupiedSpaces, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${stat.color} p-3`}>
                  <span className="text-lg font-bold text-white">#</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Occupancy */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Zone Occupancy</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Occupied</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reserved</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Out of Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Occupancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map(({ zone, occupancy }) => {
                const pct = occupancy.total > 0
                  ? Math.round((occupancy.occupied / occupancy.total) * 100)
                  : 0;
                return (
                  <tr key={zone.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{zone.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{occupancy.total}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600 font-medium">{occupancy.available}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-red-600 font-medium">{occupancy.occupied}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-yellow-600 font-medium">{occupancy.reserved}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{occupancy.outOfService}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? 'bg-red-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pricing Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Zone Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hourly Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map(({ zone }) => (
                <tr key={zone.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{zone.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{zone.zoneType}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">
                    ${zone.hourlyRate.toFixed(2)}/hr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
