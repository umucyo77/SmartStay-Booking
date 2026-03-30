import { SlidersHorizontal, X } from 'lucide-react';
import { useFilters } from '../context/useFilters';

export default function FilterPanel() {
  const { filters, setFilters, resetFilters } = useFilters();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-rose-500" />
          <h2 className="font-semibold text-gray-800">Filters</h2>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-rose-500 transition-colors"
        >
          <X className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price range (per night)
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Min</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-gray-400 text-sm mr-1">$</span>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ minPrice: Number(e.target.value) })}
                className="w-full outline-none text-sm text-gray-700"
                min={0}
              />
            </div>
          </div>
          <span className="text-gray-300 mt-5">—</span>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Max</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-gray-400 text-sm mr-1">$</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                className="w-full outline-none text-sm text-gray-700"
                min={0}
                max={50000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Minimum rating
        </label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters({ minRating: rating })}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                filters.minRating === rating
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
              }`}
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Location
        </label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => setFilters({ location: e.target.value })}
          placeholder="Any location"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-rose-400 transition-colors"
        />
      </div>
    </div>
  );
}
