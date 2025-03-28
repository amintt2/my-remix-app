import sourceGamesData from '../../sourcegame.json';

export interface Game {
  id: number | string;
  title: string;
  image?: string;
  embed?: string;
  color: string;
  featured?: boolean;
  category?: string[];
  rating?: number;
  plays?: number;
  new?: boolean;
  description?: string;
  tags?: string;
}

// Interface for source game format
interface SourceGameFormat {
  title: string;
  embed: string;
  image: string;
  tags: string;
  description: string;
}

// Function to generate a random number of plays between min and max
const getRandomPlays = (min = 30000, max = 150000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random rating between min and max
const getRandomRating = (min = 3.5, max = 5.0) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};

// Function to assign a tailwind color based on string
const getColorFromString = (str: string) => {
  const colors = [
    'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
    'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600', 
    'bg-cyan-600', 'bg-orange-600', 'bg-lime-600', 'bg-amber-600',
    'bg-emerald-600', 'bg-violet-600', 'bg-rose-600'
  ];
  
  // Simple hash function to pick a color based on string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Convert tags string to category array
const tagsToCategories = (tags: string) => {
  const tagArray = tags.split(',');
  const categoryMap: {[key: string]: string} = {
    'racing': 'racing',
    'car': 'racing',
    'truck': 'racing',
    'shooting': 'shooting',
    'gun': 'shooting',
    'weapon': 'shooting',
    'arcade': 'action',
    'action': 'action',
    'adventure': 'adventure',
    'puzzle': 'puzzle',
    'puzzles': 'puzzle',
    'mahjong': 'puzzle',
    'sport': 'sports',
    'sports': 'sports',
    'strategy': 'strategy',
    'simulation': 'simulation',
    'simulator': 'simulation',
    'clicker': 'clicker',
    'io': 'io',
    'hidden': 'puzzle',
    'hidden objects': 'puzzle',
    'connect': 'puzzle',
    'classic': 'casual',
    'html5': 'html5',
    'free': 'free'
  };
  
  const categories = new Set<string>();
  
  // Check if game is popular or new (random assignment for demo)
  if (tags.includes('popular')) {
    categories.add('popular');
  }
  
  // Map tags to categories
  tagArray.forEach(tag => {
    const normalizedTag = tag.trim().toLowerCase();
    if (categoryMap[normalizedTag]) {
      categories.add(categoryMap[normalizedTag]);
    }
  });
  
  // Ensure at least one category
  if (categories.size === 0) {
    categories.add('casual');
  }
  
  return Array.from(categories);
};

// Function to handle external image URLs
const getProxiedImageUrl = (url: string) => {
  // If it's already a relative URL (our internal images), return as is
  if (url.startsWith('/')) {
    return url;
  }
  
  // Use a reliable image proxy service to handle CORS issues
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=placeholder`;
};

// Source games from external JSON
const sourceGamesRaw = sourceGamesData as unknown as SourceGameFormat[];

// Convert the sourcegame format to our Game format
const convertedSourceGames = sourceGamesRaw.map((game, index) => {
  const categories = tagsToCategories(game.tags);
  const isNew = Math.random() > 0.7; // Random assignment for demonstration
  
  // Extract just the game name from the embed for use in routing
  const gameId = 100 + index; // Default ID if we can't extract a better one
  
  return {
    id: gameId, // Start IDs from 100 to avoid conflicts
    title: game.title,
    image: getProxiedImageUrl(game.image),
    embed: game.embed,
    color: getColorFromString(game.title),
    featured: categories.includes('popular'),
    category: categories,
    rating: getRandomRating(),
    plays: getRandomPlays(),
    new: isNew,
    description: game.description,
    tags: game.tags
  };
});

// Main game data collection
const gamesData: Game[] = [
  // Add the converted source games
  ...convertedSourceGames
];

// Service functions
export const gameService = {
  getAllGames: (): Game[] => {
    return gamesData;
  },
  
  getGameById: (id: number | string): Game | undefined => {
    return gamesData.find(game => game.id.toString() === id.toString());
  },
  
  getGamesByCategory: (category: string): Game[] => {
    return gamesData.filter(game => game.category?.includes(category));
  },
  
  getFeaturedGames: (): Game[] => {
    return gamesData.filter(game => game.featured);
  },
  
  getNewGames: (): Game[] => {
    return gamesData.filter(game => game.new);
  },
  
  getPopularGames: (): Game[] => {
    return gamesData.filter(game => game.category?.includes('popular'));
  },
  
  getTrendingGames: (): Game[] => {
    // Sort games by play count (highest first) and return top 15
    return [...gamesData]
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 15);
  },
  
  getEmbeddedGames: (): Game[] => {
    // Return games that have an embed URL
    return gamesData.filter(game => game.embed);
  },
  
  searchGames: (query: string): Game[] => {
    const lowercaseQuery = query.toLowerCase();
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(lowercaseQuery) || 
      game.description?.toLowerCase().includes(lowercaseQuery) ||
      game.tags?.toLowerCase().includes(lowercaseQuery)
    );
  }
};

export default gameService; 