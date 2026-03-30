import type { MouseEvent, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Listing } from '../types';
import { useFavorites } from '../context/useFavorites';

interface ListingCardProps {
  listing: Listing;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

export default function ListingCard({ listing }: ListingCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(listing.id);

  const toggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (favorited) {
      removeFavorite(listing.id);
      return;
    }

    addFavorite(listing);
  };

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={listing.images[0] ?? FALLBACK_IMAGE}
            alt={listing.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
              }`}
            />
          </button>
          {listing.host.isSuperhost && (
            <div className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-md">
              Superhost
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 flex-1 text-sm font-semibold leading-snug text-gray-800">
              {listing.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">{listing.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="mb-3 line-clamp-1 text-xs text-gray-400">
            {listing.city}, {listing.country}
          </p>

          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            <span>&middot;</span>
            <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            <span>&middot;</span>
            <span>Up to {listing.maxGuests} guests</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <span className="text-base font-bold text-gray-900">${listing.price}</span>
              <span className="text-xs text-gray-400"> / night</span>
            </div>
            <span className="text-xs text-gray-400">{listing.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
