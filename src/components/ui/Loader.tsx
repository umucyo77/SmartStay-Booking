export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-rose-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 text-sm font-medium animate-pulse">Finding amazing stays...</p>
    </div>
  );
}