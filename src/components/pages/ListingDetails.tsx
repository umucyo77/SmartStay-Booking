import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Bath,
  Bed,
  ExternalLink,
  Heart,
  MapPin,
  Star,
  Users,
  Wifi,
} from 'lucide-react';
import type { SyntheticEvent } from 'react';
import { useListingDetails } from '../hooks/useListingDetails';
import { useFavorites } from '../context/useFavorites';
import BookingForm from '../bookings/BookingForm';
import Loader from '../ui/Loader';
import ErrorState from '../ui/ErrorState';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: listing, isLoading, isError, error, refetch } = useListingDetails(id ?? '');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !listing) {
    return <ErrorState message={(error as Error)?.message} onRetry={() => refetch()} />;
  }

  const favorited = isFavorite(listing.id);
  const lat = listing.coordinates?.lat ?? 48.8566;
  const lng = listing.coordinates?.lng ?? 2.3522;
  const openStreetMapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.02}%2C${lng + 0.02}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${listing.name}, ${listing.city}, ${listing.country}`,
  )}`;

  const toggleFavorite = () => {
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
    <div className="mx-auto max-w-6xl px-3 sm:px-0">
      <button
        onClick={() => navigate(-1)}
        className="group mb-6 flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to listings</span>
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
            {listing.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
              <span className="font-semibold text-gray-800">{listing.rating.toFixed(1)}</span>
              <span>({listing.reviewCount} reviews)</span>
            </div>
            <span>&middot;</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-400" />
              <span>
                {listing.city}, {listing.country}
              </span>
            </div>
            {listing.host.isSuperhost && (
              <>
                <span>&middot;</span>
                <div className="flex items-center gap-1 text-blue-500">
                  <Award className="h-3.5 w-3.5" />
                  <span className="font-medium">Superhost</span>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={toggleFavorite}
          className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 transition-colors hover:border-blue-300 sm:px-4"
        >
          <div className="flex items-center gap-2">
            <Heart
              className={`h-4 w-4 ${favorited ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`}
            />
            <span className="hidden text-sm font-medium text-gray-600 sm:block">
              {favorited ? 'Saved' : 'Save'}
            </span>
          </div>
        </button>
      </div>

      <div className="mb-8 grid h-56 grid-cols-2 gap-2 overflow-hidden rounded-2xl sm:h-64 md:h-80 md:grid-cols-4">
        <div className="col-span-2 row-span-2">
          <img
            src={listing.images[0] ?? FALLBACK_IMAGE}
            alt={listing.name}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        </div>
        {listing.images.slice(1, 5).map((image, index) => (
          <div key={image || index} className="overflow-hidden">
            <img
              src={image}
              alt={`${listing.name} ${index + 2}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Hosted by {listing.host.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" />
                  {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {listing.maxGuests} guests
                </span>
              </div>
            </div>
            <img
              src={listing.host.avatar}
              alt={listing.host.name}
              className="h-12 w-12 rounded-full border-2 border-rose-100 object-cover sm:h-14 sm:w-14"
            />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">About this place</h2>
            <p className="leading-relaxed text-gray-600">{listing.description}</p>
          </div>

          {listing.amenities.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing.amenities.slice(0, 10).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-600">
                    <Wifi className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Location</h2>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <iframe
                title={`Map of ${listing.name}`}
                src={openStreetMapEmbedUrl}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-gray-600">
                <span>
                  {listing.city}, {listing.country}
                </span>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={openStreetMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                  >
                    OpenStreetMap
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                  >
                    Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <BookingForm listing={listing} />
        </div>
      </div>
    </div>
  );
}
