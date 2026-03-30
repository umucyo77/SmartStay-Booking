import { createContext } from 'react';
import type { FilterState } from '../types';

export const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  location: '',
  searchQuery: '',
};

export interface FiltersContextType {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined);
