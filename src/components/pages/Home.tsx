import { useMemo } from 'react';
import { useListings } from '../hooks/useListings';

import { MapPin, Landmark, Building2, Trees, Globe } from 'lucide-react';
import { useFilters } from '../context/useFilters';
import FilterPanel from '../listings/FilterPanel';
import Loader from '../ui/Loader';
import ErrorState from '../ui/ErrorState';
import ListingCard from '../listings/ListingCard';
import Navbar from '../layout/NavBar';

const POPULAR_DESTINATIONS = [
  { name: 'Paris', placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', icon: Landmark },
  { name: 'New York', placeId: 'ChIJOwg_06VPwokRYv534QaPC8g', icon: Building2 },
  { name: 'Tokyo', placeId: 'ChIJ51cu8IcbXWARiRtXIothAS4', icon: Globe },
  { name: 'London', placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI', icon: Landmark },
  { name: 'Bali', placeId: 'ChIJoQ8Q6NNB0S0RkOYkS7EPkSQ', icon: Trees },
];

export default function Home() {
  const { filters, setFilters } = useFilters();
  const activePlaceId = filters.location || 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ';
  const { data: listings, isLoading, isError, error, refetch } = useListings(activePlaceId);

  const filtered = useMemo(() => {
    if (!listings) return [];
    return listings.filter((l) => {
      const matchesPrice = l.price >= filters.minPrice && l.price <= filters.maxPrice;
      const matchesRating = l.rating >= filters.minRating;
      const matchesSearch =
        !filters.searchQuery ||
        l.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        l.country.toLowerCase().includes(filters.searchQuery.toLowerCase());
      return matchesPrice && matchesRating && matchesSearch;
    });
  }, [listings, filters]);

  return (
    <div>
      <Navbar />
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 bg-linear-to-br from-blue-500 via-blue-400 to-blue-500 px-6 sm:px-8 py-10 sm:py-16 text-white">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
            Find your perfect stay
          </h1>
          <p className="text-rose-100 text-base sm:text-lg">
            Discover unique homes and experiences around the world
          </p>
        </div>
        <div className="absolute right-8 bottom-0 opacity-10">
          <Building2 className="w-32 h-32 sm:w-48 sm:h-48 text-white" />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500" />
          Popular destinations
        </h2>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {POPULAR_DESTINATIONS.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.placeId}
                onClick={() => setFilters({ location: dest.placeId, searchQuery: '' })}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activePlaceId === dest.placeId
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-blue-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {dest.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <aside className="w-full lg:w-72 shrink-0">
          <FilterPanel />
        </aside>
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <ErrorState message={(error as Error)?.message} onRetry={() => refetch()} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-rose-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No listings found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {filtered.length} stay{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
