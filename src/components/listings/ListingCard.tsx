import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Listing } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(listing.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favorited ? removeFavorite(listing.id) : addFavorite(listing);
  };

  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.images[0] ?? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
            alt={listing.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
            }}
          />
          <button onClick={toggleFavorite} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform">
            <Heart className={`w-4 h-4 transition-colors ${favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
          </button>
          {listing.host.isSuperhost && (
            <div className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
              Superhost
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-1 flex-1">
              {listing.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">{listing.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs mb-3 line-clamp-1">{listing.city}, {listing.country}</p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
            <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>Up to {listing.maxGuests} guests</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-base font-bold text-gray-900">${listing.price}</span>
              <span className="text-gray-400 text-xs"> / night</span>
            </div>
            <span className="text-xs text-gray-400">{listing.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}