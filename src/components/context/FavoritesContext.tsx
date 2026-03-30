import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Listing } from '../types';
import { FavoritesContext } from './favoritesContextValue';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Listing[]>(() => {
    try {
      const stored = localStorage.getItem('stayfinder_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('stayfinder_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (listing: Listing) => {
    setFavorites((prev) => [...prev, listing]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((l) => l.id !== id));
  };

  const isFavorite = (id: string) => favorites.some((l) => l.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
