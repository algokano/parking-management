import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { listZones, getOccupancy } from '../../api/zones';
import type { ZoneResponse, OccupancyResponse } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

// Fix default marker icons for Leaflet + Vite
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createColorIcon(color: string) {
  return new L.DivIcon({
    className: '',
    html: `<div style="
      background: ${color};
      width: 28px; height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

const DORTMUND_CENTER: [number, number] = [51.5136, 7.4653];

export default function ZoneBrowserPage() {
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [occupancies, setOccupancies] = useState<Record<string, OccupancyResponse>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listZones()
      .then(async (zoneList) => {
        setZones(zoneList);
        const occResults = await Promise.allSettled(
          zoneList.map((z) => getOccupancy(z.id)),
        );
        const occMap: Record<string, OccupancyResponse> = {};
        occResults.forEach((result, idx) => {
          if (result.status === 'fulfilled') {
            occMap[zoneList[idx].id] = result.value;
          }
        });
        setOccupancies(occMap);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase()),
  );

  function getMarkerColor(zoneId: string): string {
    const occ = occupancies[zoneId];
    if (!occ || occ.total === 0) return '#6b7280';
    const pct = ((occ.total - occ.available) / occ.total) * 100;
    if (pct > 80) return '#ef4444';
    if (pct > 50) return '#f59e0b';
    return '#22c55e';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Parking Zones</h1>

      {/* Map */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <MapContainer
          center={DORTMUND_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones
            .filter((z) => z.latitude && z.longitude)
            .map((zone) => {
              const occ = occupancies[zone.id];
              const available = occ?.available ?? 0;
              const total = occ?.total ?? zone.totalSpaces;

              return (
                <Marker
                  key={zone.id}
                  position={[zone.latitude!, zone.longitude!]}
                  icon={createColorIcon(getMarkerColor(zone.id))}
                  eventHandlers={{
                    click: () => navigate(`/zones/${zone.id}`),
                  }}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="font-semibold text-gray-900">{zone.name}</p>
                      <p className="text-xs text-gray-500">{zone.address}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="font-medium text-green-600">{available}</span>
                        <span className="text-gray-400">/ {total} available</span>
                      </div>
                      <p className="mt-1 text-sm font-medium">{zone.hourlyRate.toFixed(2)} €/hr</p>
                      <Link
                        to={`/zones/${zone.id}`}
                        className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Details →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search zones by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Zone Cards */}
      {filteredZones.length === 0 ? (
        <EmptyState message="No parking zones found" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredZones.map((zone) => {
            const occ = occupancies[zone.id];
            const available = occ?.available ?? 0;
            const total = occ?.total ?? zone.totalSpaces;
            const pct = total > 0 ? ((total - available) / total) * 100 : 0;

            return (
              <Link
                key={zone.id}
                to={`/zones/${zone.id}`}
                className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {zone.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">{zone.address}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                    {zone.zoneType}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-gray-900">
                  {zone.hourlyRate.toFixed(2)} &euro;/hr
                </p>

                {/* Occupancy bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {available} / {total} available
                    </span>
                    <span>{Math.round(pct)}% occupied</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 80
                          ? 'bg-red-500'
                          : pct > 50
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
