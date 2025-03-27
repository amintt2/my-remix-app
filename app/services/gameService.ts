export interface Game {
  id: number | string;
  title: string;
  image?: string;
  color: string;
  featured?: boolean;
  category?: string[];
  rating?: number;
  plays?: number;
  new?: boolean;
  description?: string;
}

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
  { id: 15, title: 'RacingStars', image: '/images/racingstars.jpg', color: 'bg-rose-600', category: ['racing', 'sports'], rating: 4.4, plays: 75000, description: 'Compete in high-speed races against other players.' }
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
  
  searchGames: (query: string): Game[] => {
    const lowercaseQuery = query.toLowerCase();
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(lowercaseQuery) || 
      game.description?.toLowerCase().includes(lowercaseQuery)
    );
  }
};

export default gameService; 