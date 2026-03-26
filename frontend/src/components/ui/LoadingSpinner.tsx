export default function LoadingSpinner() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
    </div>
  );
}
