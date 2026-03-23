import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking } from '../types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  getBookingsByListing: (listingId: string) => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),
      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' } : b
          ),
        })),
      getBookingsByListing: (listingId) =>
        get().bookings.filter((b) => b.listingId === listingId),
    }),
    { name: 'stayfinder_bookings' }
  )
);