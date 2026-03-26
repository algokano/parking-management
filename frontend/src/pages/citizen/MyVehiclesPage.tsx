import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listVehicles, addVehicle, removeVehicle } from '../../api/vehicles';
import type { VehicleResponse } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

export default function MyVehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listVehicles(user.userId)
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const v = await addVehicle(user.userId, form);
      setVehicles((prev) => [...prev, v]);
      setForm({ licensePlate: '', make: '', model: '', color: '' });
      setShowForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add vehicle');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(vehicleId: string) {
    if (!user) return;
    try {
      await removeVehicle(user.userId, vehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to remove vehicle');
      }
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
          }}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow sm:grid-cols-2"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              License Plate
            </label>
            <input
              required
              value={form.licensePlate}
              onChange={(e) =>
                setForm((f) => ({ ...f, licensePlate: e.target.value }))
              }
              placeholder="e.g., DO-AB 1234"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <input
              required
              value={form.make}
              onChange={(e) =>
                setForm((f) => ({ ...f, make: e.target.value }))
              }
              placeholder="e.g., Volkswagen"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              required
              value={form.model}
              onChange={(e) =>
                setForm((f) => ({ ...f, model: e.target.value }))
              }
              placeholder="e.g., Golf"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              required
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              placeholder="e.g., Silver"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 ? (
        <EmptyState message="No vehicles registered yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {v.licensePlate}
                  </p>
                  <p className="text-sm text-gray-500">
                    {v.make} {v.model}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: v.color.toLowerCase(),
                      }}
                    />
                    <span className="text-sm text-gray-400">{v.color}</span>
                  </div>
                </div>
              </div>

              {confirmDeleteId === v.id ? (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    Are you sure?
                  </span>
                  <button
                    onClick={() => handleRemove(v.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-800"
                  >
                    Yes, remove
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(v.id)}
                  className="mt-4 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
