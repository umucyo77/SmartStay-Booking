import { useNavigate } from 'react-router-dom';
import { Calendar, Users, X, CheckCircle, Clock, XCircle, Lock, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';

const statusConfig = {
  confirmed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Confirmed' },
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  cancelled: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Cancelled' },
};

export default function Bookings() {
  const { bookings, cancelBooking } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20 px-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-rose-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Login required</h2>
        <p className="text-gray-400 text-sm mb-6">You need to be logged in to view your bookings</p>
        <button onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm font-medium hover:bg-rose-600 transition-colors">
          Go to login
        </button>
      </div>
    );
  }

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success('Booking cancelled');
  };

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your bookings</h1>
        <p className="text-gray-400 text-sm mt-1">
          {activeBookings.length} booking{activeBookings.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {activeBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-rose-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm mb-6">Start exploring and book your perfect stay</p>
          <button onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm font-medium hover:bg-rose-600 transition-colors">
            Explore stays
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeBookings.map((booking) => {
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;
            return (
              <div key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 h-48 sm:h-auto shrink-0">
                    <img
                      src={booking.listingImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                      alt={booking.listingName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400';
                      }}
                    />
                  </div>
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{booking.listingName}</h3>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} shrink-0`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-xs sm:text-sm">{booking.checkIn} → {booking.checkOut}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-xs sm:text-sm">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">${booking.totalPrice}</span>
                      <button onClick={() => handleCancel(booking.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}