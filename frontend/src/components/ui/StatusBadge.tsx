interface StatusBadgeProps {
  status: string;
}

const colorMap: Record<string, string> = {
  // Green
  AVAILABLE: 'bg-green-100 text-green-800',
  ACTIVE: 'bg-green-100 text-green-800',
  PAID: 'bg-green-100 text-green-800',
  // Red
  OCCUPIED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800',
  FAILED: 'bg-red-100 text-red-800',
  // Yellow
  RESERVED: 'bg-yellow-100 text-yellow-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  // Gray
  OUT_OF_SERVICE: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = colorMap[status] ?? 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
