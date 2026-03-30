import { useState } from 'react';
import type { ReactNode } from 'react';
import type { FilterState } from '../types';
import { defaultFilters, FiltersContext } from './filtersContextValue';

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => setFiltersState(defaultFilters);

  return (
    <FiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}
