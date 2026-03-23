import { useQuery } from '@tanstack/react-query';
import { fetchListings } from '../services/listingService';


export function useListings(placeId?: string) {
  return useQuery({
    queryKey: ['listings', placeId ?? 'default'],
    queryFn: () => fetchListings(placeId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}