export interface Listing {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  location: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  host: {
    id: string;
    name: string;
    avatar: string;
    isSuperhost: boolean;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  listingId: string;
  listingName: string;
  listingImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  location: string;
  searchQuery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}