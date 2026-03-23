import { useQuery } from '@tanstack/react-query';
import { fetchListingById } from '../services/listingsService';

export function useListingDetails(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListingById(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!id,
    retry: 2,
  });
}