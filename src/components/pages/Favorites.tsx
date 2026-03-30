import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/useFavorites';
import ListingCard from '../listings/ListingCard';
import Navbar from '../layout/NavBar';

export default function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <Navbar />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 fill-blue-500 text-blue-500" />
          Saved stays
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {favorites.length} saved {favorites.length === 1 ? 'stay' : 'stays'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved stays yet</h3>
          <p className="text-gray-400 text-sm mb-6">Tap the heart on any listing to save it here</p>
          <button onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
            Explore stays
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
