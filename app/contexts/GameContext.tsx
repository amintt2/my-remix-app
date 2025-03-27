import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Game } from '~/services/gameService';

interface GameContextType {
  favorites: Game[];
  playHistory: Game[];
  addToFavorites: (game: Game) => void;
  removeFromFavorites: (gameId: string | number) => void;
  isGameFavorite: (gameId: string | number) => boolean;
  addToPlayHistory: (game: Game) => void;
  clearPlayHistory: () => void;
}

const defaultContext: GameContextType = {
  favorites: [],
  playHistory: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isGameFavorite: () => false,
  addToPlayHistory: () => {},
  clearPlayHistory: () => {},
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [playHistory, setPlayHistory] = useState<Game[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('gamesFavorites');
      const storedHistory = localStorage.getItem('gamesHistory');
      
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      
      if (storedHistory) {
        setPlayHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading game data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('gamesFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('gamesHistory', JSON.stringify(playHistory));
    } catch (error) {
      console.error('Error saving play history to localStorage:', error);
    }
  }, [playHistory]);

  const addToFavorites = (game: Game) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(g => g.id === game.id)) {
        return prevFavorites; // Game already in favorites
      }
      return [...prevFavorites, game];
    });
  };

  const removeFromFavorites = (gameId: string | number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(game => game.id !== gameId)
    );
  };

  const isGameFavorite = (gameId: string | number) => {
    return favorites.some(game => game.id === gameId);
  };

  const addToPlayHistory = (game: Game) => {
    setPlayHistory(prevHistory => {
      // Remove the game from history if it already exists
      const filteredHistory = prevHistory.filter(g => g.id !== game.id);
      // Add the game to the beginning of the history array
      return [game, ...filteredHistory].slice(0, 20); // Keep only the 20 most recent games
    });
  };

  const clearPlayHistory = () => {
    setPlayHistory([]);
  };

  return (
    <GameContext.Provider
      value={{
        favorites,
        playHistory,
        addToFavorites,
        removeFromFavorites,
        isGameFavorite,
        addToPlayHistory,
        clearPlayHistory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 