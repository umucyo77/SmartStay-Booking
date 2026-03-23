import api from './api';

import type { Listing } from '../types';
import { transformListings } from '../utils/transformers';

export async function fetchListings(
  location: string = 'Paris'
): Promise<Listing[]> {
  const { data } = await api.get('/api/v1/searchPropertyByLocationV2', {
    params: {
      location,
      totalRecords: 12,
      currency: 'USD',
      adults: '2',
    },
  });
  return transformListings(data);
}

export async function fetchListingById(id: string): Promise<Listing> {
  const { data } = await api.get('/api/v1/searchPropertyByLocationV2', {
    params: {
      location: id,
      totalRecords: 1,
      currency: 'USD',
      adults: '2',
    },
  });
  const listings = transformListings(data);
  if (listings.length === 0) throw new Error('Listing not found');
  return listings[0];
}