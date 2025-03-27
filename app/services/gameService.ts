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
interface SourceGame {
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
    'sport': 'sports',
    'sports': 'sports',
    'strategy': 'strategy',
    'simulation': 'simulation',
    'simulator': 'simulation',
    'clicker': 'clicker',
    'io': 'io'
  };
  
  const categories = new Set<string>();
  
  // Check if game is popular or new (random assignment for demo)
  if (Math.random() > 0.8) {
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

// Convert source games from JSON to our format
const convertSourceGames = (games: SourceGame[]) => {
  return games.map((game, index) => {
    const categories = tagsToCategories(game.tags);
    const isNew = Math.random() > 0.7; // Random assignment for demonstration
    
    return {
      id: 100 + index, // Start IDs from 100 to avoid conflicts
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
};

// Source games from external JSON
const sourceGames: SourceGame[] = [
  {
    "title": "Mr Space Bullet",
    "embed": "https://www.onlinegames.io/games/2021/4/mr-space-bullet/index.html",
    "image": "https://www.onlinegames.io/media/posts/707/responsive/Mr-Space-Bullet-xs.jpg",
    "tags": "1-player,2d,arcade,free,gun,mobile,mouse,shooting,space,weapon",
    "description": "Mr Space Bullet is a 2D shooting game where you will be on a staircase in outer space. While trying to climb up, you will come across many aliens on your way. Your job is to aim at your enemies precisely at their heads. \nShoot the alien you encounter on every stair without blinking an eye."
  },
  {
    "title": "Truck Racing",
    "embed": "https://www.onlinegames.io/games/2022/construct/144/truck-racing/index.html",
    "image": "https://www.onlinegames.io/media/posts/712/responsive/Truck-Racing-xs.jpg",
    "tags": "1-player,2d,car,crazy,free,html5,mobile,racing,truck",
    "description": "Roads are tough, and slopes are steep. Dropping the cargo box is bleep. \nFrom doorstep to destination, your job here is to be a trusty delivery truck driver. Truck Racing is an online driving game where you transport and deliver boxes without damaging them."
  },
  {
    "title": "Jackpot Casino",
    "embed": "https://www.onlinegames.io/games/2021/4/jackpot-casino/index.html",
    "image": "https://www.onlinegames.io/media/posts/635/responsive/Jackpot-Casino-xs.jpg",
    "tags": "1-player,2d,crazy,free,fun,html5,mobile,mouse,simulator",
    "description": "Jackpot Casino is a free slot game where your main aim is to line up the same symbols on the slot machine side by side to claim your prize. You will see that the machine is adorned with many symbols. Spin the reels and try to get at least three identical tokens shoulder-to-shoulder. Hit the jackpot in this exciting kids game!"
  }
];

// Convert source games
const convertedSourceGames = convertSourceGames(sourceGames);

// Main game data collection
const gamesData: Game[] = [
  { id: 1, title: 'WorldGuessr', image: '/images/worldguessr.jpg', featured: true, color: 'bg-blue-600', category: ['popular', 'puzzle', 'adventure'], rating: 4.8, plays: 125000, description: 'Test your geography knowledge by guessing locations around the world.' },
  { id: 2, title: 'PolyTrack', image: '/images/polytrack.jpg', featured: true, color: 'bg-green-600', category: ['popular', 'racing', 'action'], rating: 4.6, plays: 98000, description: 'Race through dynamic polygonal tracks in this fast-paced racing game.' },
  { id: 3, title: 'BlueRun', image: '/images/bluerun.jpg', featured: true, color: 'bg-purple-600', category: ['popular', 'adventure', 'action'], rating: 4.7, plays: 110000, description: 'Navigate through challenging obstacles in this endless runner.' },
  { id: 4, title: 'Bloxd.io', image: '/images/bloxdio.jpg', featured: true, color: 'bg-red-600', category: ['popular', 'io', 'strategy'], rating: 4.9, plays: 150000, description: 'Build, compete, and survive in this multiplayer block-building game.' },
  { id: 5, title: 'RPG Rush', image: '/images/rpgrush.jpg', color: 'bg-yellow-600', category: ['popular', 'adventure', 'action'], rating: 4.5, plays: 85000, description: 'Quick RPG adventures with fast-paced combat and progression.' },
  { id: 6, title: 'DragonFlight', image: '/images/dragonflight.jpg', color: 'bg-indigo-600', category: ['action', 'adventure', 'shooting'], rating: 4.3, plays: 75000, description: 'Soar through the skies on a dragon and battle enemies.' },
  { id: 7, title: 'BubbleRoll', image: '/images/bubbleroll.jpg', color: 'bg-pink-600', category: ['puzzle', 'casual'], rating: 4.2, plays: 65000, description: 'Match and pop bubbles in this addictive puzzle game.' },
  { id: 8, title: 'Empire Clash', image: '/images/empireclash.jpg', color: 'bg-teal-600', category: ['strategy', 'simulation'], rating: 4.4, plays: 80000, description: 'Build your empire and clash with rivals in this strategy game.' },
  { id: 9, title: 'OceanDive', image: '/images/oceandive.jpg', color: 'bg-cyan-600', category: ['adventure', 'simulation'], rating: 4.1, plays: 60000, description: 'Explore the depths of the ocean in this immersive diving simulator.' },
  { id: 10, title: 'SpeedClick', image: '/images/speedclick.jpg', color: 'bg-orange-600', category: ['clicker', 'casual'], new: true, rating: 4.0, plays: 50000, description: 'Test your clicking speed and reflexes.' },
  { id: 11, title: 'TowerDefense', image: '/images/towerdefense.jpg', color: 'bg-lime-600', category: ['strategy', 'action'], new: true, rating: 4.7, plays: 90000, description: 'Defend your territory by strategically placing towers.' },
  { id: 12, title: 'ZombieCrush', image: '/images/zombiecrush.jpg', color: 'bg-amber-600', category: ['action', 'shooting'], new: true, rating: 4.6, plays: 85000, description: 'Survive the zombie apocalypse in this action-packed shooter.' },
  { id: 13, title: 'PuzzleMaster', image: '/images/puzzlemaster.jpg', color: 'bg-emerald-600', category: ['puzzle'], new: true, rating: 4.5, plays: 70000, description: 'Challenge your mind with intricate puzzles.' },
  { id: 14, title: 'SpaceShooter', image: '/images/spaceshooter.jpg', color: 'bg-violet-600', category: ['shooting', 'action'], new: true, rating: 4.3, plays: 65000, description: 'Defend the galaxy in this classic space shooter.' },
  { id: 15, title: 'RacingStars', image: '/images/racingstars.jpg', color: 'bg-rose-600', category: ['racing', 'sports'], rating: 4.4, plays: 75000, description: 'Compete in high-speed races against other players.' },
  
  // New games for additional categories
  { id: 16, title: 'SportsMania', image: '/images/sportsmania.jpg', color: 'bg-blue-500', category: ['sports', 'simulation'], new: true, rating: 4.5, plays: 72000, description: 'Multi-sport simulation with realistic physics and controls.' },
  { id: 17, title: 'Basketball Pro', image: '/images/basketballpro.jpg', color: 'bg-orange-500', category: ['sports', 'action'], rating: 4.3, plays: 68000, description: 'Play as your favorite basketball stars in this slam dunk simulator.' },
  { id: 18, title: 'Soccer Champions', image: '/images/soccerchampions.jpg', color: 'bg-green-500', category: ['sports', 'popular'], rating: 4.7, plays: 95000, description: 'Lead your team to victory in this strategic soccer management game.' },
  { id: 19, title: 'Sniper Elite', image: '/images/sniperelite.jpg', color: 'bg-gray-700', category: ['shooting', 'action'], rating: 4.6, plays: 88000, description: 'Precision shooting with realistic bullet physics and stealth mechanics.' },
  { id: 20, title: 'Zombie Apocalypse', image: '/images/zombieapocalypse.jpg', color: 'bg-red-700', category: ['shooting', 'action', 'popular'], rating: 4.5, plays: 92000, description: 'Survive waves of zombies in this intense first-person shooter.' },
  { id: 21, title: 'Formula Racer', image: '/images/formularacer.jpg', color: 'bg-yellow-500', category: ['racing', 'simulation'], rating: 4.2, plays: 65000, description: 'Experience high-speed Formula racing with realistic car handling.' },
  { id: 22, title: 'Drift King', image: '/images/driftking.jpg', color: 'bg-purple-500', category: ['racing', 'action'], new: true, rating: 4.4, plays: 70000, description: 'Master the art of drifting in this high-octane racing game.' },
  { id: 23, title: 'City Builder', image: '/images/citybuilder.jpg', color: 'bg-cyan-500', category: ['simulation', 'strategy'], rating: 4.7, plays: 85000, description: 'Build and manage your own thriving metropolis.' },
  { id: 24, title: 'Farm Life', image: '/images/farmlife.jpg', color: 'bg-green-600', category: ['simulation', 'casual'], rating: 4.1, plays: 62000, description: 'Experience the joys and challenges of running a virtual farm.' },
  { id: 25, title: 'War Commander', image: '/images/warcommander.jpg', color: 'bg-red-600', category: ['strategy', 'popular'], rating: 4.8, plays: 105000, description: 'Lead your armies to victory in this epic real-time strategy game.' },
  { id: 26, title: 'Chess Master', image: '/images/chessmaster.jpg', color: 'bg-amber-700', category: ['strategy', 'puzzle'], rating: 4.5, plays: 75000, description: 'Challenge your mind with classic chess and unique variants.' },
  { id: 27, title: 'Cookie Clicker Pro', image: '/images/cookieclicker.jpg', color: 'bg-amber-500', category: ['clicker', 'casual', 'popular'], rating: 4.3, plays: 120000, description: 'The ultimate idle clicker game with endless upgrades and achievements.' },
  { id: 28, title: 'Tycoon Tapper', image: '/images/tycoontapper.jpg', color: 'bg-green-500', category: ['clicker', 'simulation'], new: true, rating: 4.2, plays: 55000, description: 'Build your business empire with simple but addictive tapping mechanics.' },
  { id: 29, title: 'Battle.io', image: '/images/battleio.jpg', color: 'bg-blue-600', category: ['io', 'action', 'popular'], rating: 4.6, plays: 130000, description: 'Compete against players worldwide in this fast-paced battle arena.' },
  { id: 30, title: 'Snake.io', image: '/images/snakeio.jpg', color: 'bg-green-400', category: ['io', 'casual'], rating: 4.4, plays: 110000, description: 'Grow your snake by consuming power-ups and outmaneuvering opponents.' },
  
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