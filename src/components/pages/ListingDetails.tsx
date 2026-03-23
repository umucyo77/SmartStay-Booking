import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Users, Bed, Bath, Wifi, Award, Heart } from 'lucide-react';
import { useListingDetails } from '../hooks/useListingDetails';
import BookingForm from '../components/bookings/BookingForm';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { useFavorites } from '../context/FavoritesContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: listing, isLoading, isError, error, refetch } = useListingDetails(id ?? '');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (isLoading) return <Loader />;
  if (isError || !listing)
    return <ErrorState message={(error as Error)?.message} onRetry={() => refetch()} />;

  const favorited = isFavorite(listing.id);
  const lat = listing.coordinates?.lat ?? 48.8566;
  const lng = listing.coordinates?.lng ?? 2.3522;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-0">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to listings</span>
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="font-semibold text-gray-800">{listing.rating.toFixed(1)}</span>
              <span>({listing.reviewCount} reviews)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{listing.city}, {listing.country}</span>
            </div>
            {listing.host.isSuperhost && (
              <>
                <span>·</span>
                <div className="flex items-center gap-1 text-rose-500">
                  <Award className="w-3.5 h-3.5" />
                  <span className="font-medium">Superhost</span>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => favorited ? removeFavorite(listing.id) : addFavorite(listing)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:border-rose-300 transition-colors shrink-0">
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-gray-600 hidden sm:block">{favorited ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8 h-56 sm:h-64 md:h-80">
        <div className="col-span-2 row-span-2">
          <img src={listing.images[0] ?? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
            alt={listing.name} className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'; }} />
        </div>
        {listing.images.slice(1, 5).map((img, i) => (
          <div key={i} className="overflow-hidden">
            <img src={img} alt={`${listing.name} ${i + 2}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'; }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Hosted by {listing.host.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {listing.maxGuests} guests</span>
              </div>
            </div>
            <img src={listing.host.avatar} alt={listing.host.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-rose-100" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this place</h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {listing.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing.amenities.slice(0, 10).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                    <Wifi className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
            <div className="rounded-2xl overflow-hidden h-64 z-0">
              <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={markerIcon}>
                  <Popup>{listing.name}<br />{listing.city}, {listing.country}</Popup>
                </Marker>
              </MapContainer>
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