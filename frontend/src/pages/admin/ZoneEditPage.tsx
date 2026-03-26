import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { ZoneType, CreateZoneRequest, UpdateZoneRequest } from '../../types';
import { getZone, createZone, updateZone } from '../../api/zones';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ZONE_TYPES: ZoneType[] = ['STREET', 'GARAGE', 'LOT'];

export default function ZoneEditPage() {
  const navigate = useNavigate();
  const { zoneId } = useParams<{ zoneId: string }>();
  const isEditMode = Boolean(zoneId);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [zoneType, setZoneType] = useState<ZoneType>('STREET');
  const [hourlyRate, setHourlyRate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (!isEditMode || !zoneId) return;

    async function fetchZone() {
      try {
        setLoading(true);
        const zone = await getZone(zoneId);
        setName(zone.name);
        setAddress(zone.address);
        setZoneType(zone.zoneType);
        setHourlyRate(String(zone.hourlyRate));
        if (zone.latitude != null) setLatitude(String(zone.latitude));
        if (zone.longitude != null) setLongitude(String(zone.longitude));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load zone');
      } finally {
        setLoading(false);
      }
    }
    fetchZone();
  }, [isEditMode, zoneId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !address.trim() || !hourlyRate.trim()) {
      setError('Name, address, and hourly rate are required.');
      return;
    }

    const rate = parseFloat(hourlyRate);

    if (isNaN(rate) || rate < 0) {
      setError('Hourly rate must be a valid non-negative number.');
      return;
    }

    const lat = latitude.trim() ? parseFloat(latitude) : undefined;
    const lng = longitude.trim() ? parseFloat(longitude) : undefined;

    if (latitude.trim() && (isNaN(lat!) || lat! < -90 || lat! > 90)) {
      setError('Latitude must be between -90 and 90.');
      return;
    }

    if (longitude.trim() && (isNaN(lng!) || lng! < -180 || lng! > 180)) {
      setError('Longitude must be between -180 and 180.');
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode && zoneId) {
        const data: UpdateZoneRequest = {
          name: name.trim(),
          address: address.trim(),
          zoneType,
          hourlyRate: rate,
          latitude: lat,
          longitude: lng,
        };
        await updateZone(zoneId, data);
      } else {
        const data: CreateZoneRequest = {
          name: name.trim(),
          address: address.trim(),
          zoneType,
          hourlyRate: rate,
          latitude: lat,
          longitude: lng,
        };
        await createZone(data);
      }

      navigate('/admin/zones');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save zone');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {isEditMode ? 'Edit Zone' : 'Create New Zone'}
      </h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Downtown Garage"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div>
          <label htmlFor="zoneType" className="block text-sm font-medium text-gray-700">
            Zone Type <span className="text-red-500">*</span>
          </label>
          <select
            id="zoneType"
            value={zoneType}
            onChange={(e) => setZoneType(e.target.value as ZoneType)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ZONE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
            Hourly Rate ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="hourlyRate"
            type="number"
            step="0.01"
            min="0"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="2.50"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="41.3851"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="2.1734"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Zone' : 'Create Zone'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/zones')}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
