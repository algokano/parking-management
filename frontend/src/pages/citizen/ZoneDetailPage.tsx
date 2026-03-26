import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { getZone, getOccupancy } from '../../api/zones';
import { listSpaces } from '../../api/spaces';
import { listVehicles } from '../../api/vehicles';
import { createReservation } from '../../api/reservations';
import { startSession } from '../../api/sessions';
import type {
  ZoneResponse,
  OccupancyResponse,
  SpaceResponse,
  VehicleResponse,
} from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';

type ModalType = 'reserve' | 'session' | null;

export default function ZoneDetailPage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [zone, setZone] = useState<ZoneResponse | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyResponse | null>(null);
  const [spaces, setSpaces] = useState<SpaceResponse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!zoneId) return;
    try {
      const [z, o, s] = await Promise.all([
        getZone(zoneId),
        getOccupancy(zoneId),
        listSpaces(zoneId),
      ]);
      setZone(z);
      setOccupancy(o);
      setSpaces(s);
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (user) {
      listVehicles(user.userId).then(setVehicles).catch(() => {});
    }
  }, [user]);

  function openModal(type: ModalType, spaceId: string) {
    setModalType(type);
    setSelectedSpaceId(spaceId);
    setSelectedVehicleId(vehicles.length > 0 ? vehicles[0].id : '');
    setStartTime('');
    setEndTime('');
    setError(null);
  }

  function closeModal() {
    setModalType(null);
    setSelectedSpaceId(null);
    setError(null);
  }

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSpaceId || !selectedVehicleId || !startTime || !endTime) return;
    setSubmitting(true);
    setError(null);
    try {
      await createReservation({
        userId: user!.userId,
        vehicleId: String(selectedVehicleId),
        zoneId: zoneId!,
        spaceId: String(selectedSpaceId),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      closeModal();
      setSuccessMessage('Reservation created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create reservation');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStartSession(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSpaceId || !selectedVehicleId) return;
    setSubmitting(true);
    setError(null);
    try {
      await startSession({
        userId: user!.userId,
        vehicleId: String(selectedVehicleId),
        zoneId: zoneId!,
        spaceId: String(selectedSpaceId),
      });
      closeModal();
      setSuccessMessage('Parking session started!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to start session');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!zone) return <p className="text-gray-500">Zone not found</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        &larr; Back to zones
      </button>

      {/* Success message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {/* Zone Info */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{zone.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{zone.address}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
              {zone.zoneType}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {zone.hourlyRate.toFixed(2)} &euro;/hr
            </span>
          </div>
        </div>
      </div>

      {/* Occupancy Stats */}
      {occupancy && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { label: 'Total', value: occupancy.total, color: 'text-gray-900' },
            { label: 'Available', value: occupancy.available, color: 'text-green-600' },
            { label: 'Occupied', value: occupancy.occupied, color: 'text-red-600' },
            { label: 'Reserved', value: occupancy.reserved, color: 'text-yellow-600' },
            { label: 'Out of Service', value: occupancy.outOfService, color: 'text-gray-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white p-4 text-center shadow">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* All Spaces */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Spaces</h2>
        {spaces.length === 0 ? (
          <p className="text-sm text-gray-500">No spaces found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    {space.spaceNumber}
                  </span>
                  <StatusBadge status={space.status} />
                </div>
                {space.status === 'AVAILABLE' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('reserve', space.id)}
                      className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      Reserve
                    </button>
                    <button
                      onClick={() => openModal('session', space.id)}
                      className="rounded bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                    >
                      Start Session
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reserve Modal */}
      {modalType === 'reserve' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Reserve Space
            </h3>
            {error && (
              <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleReserve} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle
                </label>
                {vehicles.length === 0 ? (
                  <p className="mt-1 text-sm text-red-500">
                    No vehicles registered. Please add a vehicle first.
                  </p>
                ) : (
                  <select
                    required
                    value={selectedVehicleId}
                    onChange={(e) =>
                      setSelectedVehicleId(e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.licensePlate} - {v.make} {v.model}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || vehicles.length === 0}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Reserving...' : 'Reserve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Start Session Modal */}
      {modalType === 'session' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Start Parking Session
            </h3>
            {error && (
              <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleStartSession} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle
                </label>
                {vehicles.length === 0 ? (
                  <p className="mt-1 text-sm text-red-500">
                    No vehicles registered. Please add a vehicle first.
                  </p>
                ) : (
                  <select
                    required
                    value={selectedVehicleId}
                    onChange={(e) =>
                      setSelectedVehicleId(e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.licensePlate} - {v.make} {v.model}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || vehicles.length === 0}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Starting...' : 'Start Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
