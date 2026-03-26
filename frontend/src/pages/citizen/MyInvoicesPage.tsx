import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listInvoices, payInvoice } from '../../api/billing';
import type { InvoiceResponse, PaymentMethod } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'WALLET', label: 'Wallet' },
];

export default function MyInvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listInvoices(user.userId)
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, [user]);

  async function handlePay(id: string) {
    setProcessing(true);
    setError(null);
    try {
      const result = await payInvoice(id, { paymentMethod: selectedMethod });
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                status: result.successful ? 'PAID' as const : 'FAILED' as const,
                paidAt: result.successful ? result.processedAt : inv.paidAt,
              }
            : inv,
        ),
      );
      setPayingId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Payment failed');
      }
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <EmptyState message="No invoices found" />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Issued
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Paid At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Zone
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
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      #{inv.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                      {inv.amount.toFixed(2)} &euro;
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(inv.issuedAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {inv.paidAt
                        ? new Date(inv.paidAt).toLocaleString()
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {inv.zoneName ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {inv.status === 'PENDING' &&
                        (payingId === inv.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedMethod}
                              onChange={(e) =>
                                setSelectedMethod(
                                  e.target.value as PaymentMethod,
                                )
                              }
                              className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              {PAYMENT_METHODS.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handlePay(inv.id)}
                              disabled={processing}
                              className="rounded bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                            >
                              {processing ? 'Processing...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => {
                                setPayingId(null);
                                setError(null);
                              }}
                              className="text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPayingId(inv.id)}
                            className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                          >
                            Pay
                          </button>
                        ))}
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
