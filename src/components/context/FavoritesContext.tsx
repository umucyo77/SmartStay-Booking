import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Listing } from '../types';

interface FavoritesContextType {
  favorites: Listing[];
  addFavorite: (listing: Listing) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

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

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}