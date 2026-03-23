import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import type { Listing } from '../types';

interface BookingFormProps {
  listing: Listing;
}

export default function BookingForm({ listing }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const { addBooking } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const totalPrice = nights * listing.price;

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a booking');
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }

    const booking = {
      id: `booking_${Date.now()}`,
      listingId: listing.id,
      listingName: listing.name,
      listingImage: listing.images[0] ?? '',
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    toast.success('Booking confirmed!');
    navigate('/bookings');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-24">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-2xl font-bold text-gray-900">${listing.price}</span>
        <span className="text-gray-400 text-sm">/ night</span>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Check-in
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2 focus-within:border-rose-400 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Check-out
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2 focus-within:border-rose-400 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Guests
        </label>
        <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2 focus-within:border-rose-400 transition-colors">
          <Users className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min={1}
            max={listing.maxGuests}
            className="w-full outline-none text-sm text-gray-700 bg-transparent"
          />
          <span className="text-xs text-gray-400">max {listing.maxGuests}</span>
        </div>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${listing.price} Ã— {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service fee</span>
            <span>${Math.round(totalPrice * 0.12)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>${totalPrice + Math.round(totalPrice * 0.12)}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleBooking}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
      >
        {isAuthenticated ? 'Reserve now' : 'Login to book'}
      </button>
    </div>
  );
}