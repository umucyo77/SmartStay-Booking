import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, BookOpen, Search, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import SearchBar from '../ui/SearchBar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileSearch, setMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {mobileSearch ? (
          <div className="flex items-center gap-3 h-16">
            <div className="flex-1">
              <SearchBar />
            </div>
            <button onClick={() => setMobileSearch(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-rose-500 font-bold text-xl hidden sm:block">StayFinder</span>
            </Link>

            <div className="flex-1 justify-center hidden md:flex">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMobileSearch(true)}
                className="p-2 rounded-full hover:bg-gray-100 md:hidden"
              >
                <Search className="w-5 h-5 text-gray-500" />
              </button>

              <Link to="/favorites" className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:block">Favorites</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/bookings" className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:block">Bookings</span>
                  </Link>
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                    <img
                      src={user?.avatar ?? 'https://i.pravatar.cc/150'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500" title="Logout">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-medium hover:bg-rose-600 transition-colors">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}