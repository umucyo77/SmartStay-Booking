/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Listing } from '../types';

export function transformListing(raw: any): Listing {
  const listing = raw?.listing ?? raw;
  const pictures = raw?.contextualPictures ?? listing?.contextualPictures ?? [];

  const priceString =
    raw?.structuredDisplayPrice?.primaryLine?.discountedPrice ??
    raw?.structuredDisplayPrice?.primaryLine?.price ??
    raw?.price ??
    '$100';
  const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 100;
  const nights = 5;
  const perNight = Math.round(priceNumber / nights) || 100;

  const ratingLocalized = raw?.avgRatingLocalized ?? raw?.rating ?? '4.5';
  const ratingMatch = String(ratingLocalized).match(/[\d.]+/);
  const rating = ratingMatch ? parseFloat(ratingMatch[0]) : 4.5;

  const reviewMatch = raw?.avgRatingA11yLabel?.match(/(\d+)\s+review/);
  const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 0;

  const isSuperhost =
    raw?.badges?.some((b: any) => b?.loggingContext?.badgeType === 'SUPERHOST') ??
    listing?.primaryHostPassport?.isSuperhost ??
    false;

  const city =
    raw?.demandStayListing?.location?.city ??
    listing?.legacyLocalizedCityName ??
    listing?.legacyCity ??
    raw?.city ??
    'Paris';

  const country =
    raw?.demandStayListing?.location?.country ??
    listing?.legacyCountry ??
    raw?.country ??
    'France';

  const images = pictures.map((p: any) => p?.picture ?? p?.url ?? p).filter(
    (p: any) => typeof p === 'string' && p.startsWith('http')
  );

  return {
    id: String(listing?.id ?? raw?.id ?? Math.random()),
    name: raw?.title ?? listing?.legacyName ?? 'Beautiful Property',
    description: `${raw?.title ?? 'Beautiful property'} located in ${city}. A wonderful place to stay with great amenities and a perfect location.`,
    price: perNight,
    currency: 'USD',
    rating: isNaN(rating) ? 4.5 : rating,
    reviewCount,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    location: city,
    city,
    country,
    bedrooms: raw?.bedrooms ?? listing?.bedrooms ?? 1,
    bathrooms: raw?.bathrooms ?? listing?.bathrooms ?? 1,
    maxGuests: raw?.personCapacity ?? listing?.personCapacity ?? 2,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Heating'],
    host: {
      id: String(listing?.primaryHostPassport?.userId ?? '1'),
      name: listing?.primaryHostPassport?.name ?? 'Your Host',
      avatar: listing?.primaryHostPassport?.thumbnailUrl ?? 'https://i.pravatar.cc/150',
      isSuperhost,
    },
    coordinates: {
      lat: listing?.legacyCoordinate?.latitude ?? 48.8566,
      lng: listing?.legacyCoordinate?.longitude ?? 2.3522,
    },
  };
}

export function transformListings(data: any): Listing[] {
  const list =
    data?.data?.list ??
    data?.data?.results ??
    data?.list ??
    data?.results ??
    data?.data ??
    [];

  console.log('API raw response:', JSON.stringify(data).slice(0, 500));
  console.log('Extracted list length:', Array.isArray(list) ? list.length : 'not array');

  if (!Array.isArray(list)) return [];
  return list.map(transformListing).filter((l) => l.id && l.name);
}