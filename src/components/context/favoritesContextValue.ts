import { createContext } from 'react';
import type { Listing } from '../types';

export interface FavoritesContextType {
  favorites: Listing[];
  addFavorite: (listing: Listing) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
