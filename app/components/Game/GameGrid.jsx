import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import GameCard from './GameCard.jsx';
import { gameService } from '../../services/gameService';
import { useGameContext } from '../../contexts/GameContext';

export default function GameGrid() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isGameFavorite, addToFavorites, removeFromFavorites } = useGameContext();

  useEffect(() => {
    // Load game data from the service
    setFeaturedGames(gameService.getFeaturedGames().slice(0, 8));
    
    // Create categories with games from the service
    setCategories([
      { id: 'action', title: 'Jeux d\'action', games: gameService.getGamesByCategory('action').slice(0, 8) },
      { id: 'puzzle', title: 'Jeux de Puzzle', games: gameService.getGamesByCategory('puzzle').slice(0, 8) },
      { id: 'racing', title: 'Jeux de Course', games: gameService.getGamesByCategory('racing').slice(0, 8) },
      { id: 'adventure', title: 'Jeux d\'Aventure', games: gameService.getGamesByCategory('adventure').slice(0, 8) },
      { id: 'sports', title: 'Jeux Sports', games: gameService.getGamesByCategory('sports').slice(0, 8) }
    ]);
  }, []);

  const handleFavoriteToggle = (game) => {
    if (isGameFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 text-gray-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-850 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-700/50">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-blue-600 text-white text-xl font-bold w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">W</div>
          <div className="ml-3">
            <div className="text-sm text-gray-400">Bienvenue sur</div>
            <div className="font-bold text-base text-white">CrazyGames</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-x-4 gap-y-2 text-xs w-full sm:w-auto">
          {[
            { icon: 'users', text: '4000+ jeux' },
            { icon: 'check-circle', text: 'Aucune installation' },
            { icon: 'globe-alt', text: 'Joue de partout' },
            { icon: 'eye', text: 'Jouer avec amis' },
            { icon: 'currency-dollar', text: '100% gratuit' }
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <InfoIcon icon={item.icon} className="w-4 h-4 text-indigo-400 mr-1.5 flex-shrink-0" />
              <span className="text-xs text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Games */}
        <section className="py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredGames.map(game => (
              <div key={game.id} className="relative">
                <GameCard game={game} variant="featured" />
                <button 
                  onClick={() => handleFavoriteToggle(game)}
                  className="absolute top-2 right-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 p-1.5 rounded-full"
                >
                  <svg className={`w-4 h-4 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Game Categories */}
        {categories.map((category, index) => (
          <section key={category.id} className="py-4 md:py-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {index < 3 && <CategoryIcon index={index} className="w-5 h-5 text-indigo-400 mr-2" />}
                <h2 className="text-lg font-bold text-white">{category.title}</h2>
              </div>
              <a href={`/${category.id}`} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Voir plus
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {category.games.slice(0, 5).map(game => (
                <div key={game.id} className="relative">
                  <GameCard game={game} />
                  <button 
                    onClick={() => handleFavoriteToggle(game)}
                    className="absolute top-2 right-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 p-1.5 rounded-full"
                  >
                    <svg className={`w-4 h-4 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// Helper component for Info Icons
function InfoIcon({ icon, className }) {
  const icons = {
    'users': <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>,
    'check-circle': <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>,
    'globe-alt': <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>,
    'eye': (<>
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
    </>),
    'currency-dollar': <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v1H8a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 100-2h-1V6z" clipRule="evenodd"></path>,
  };
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      {icons[icon] || <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>}
    </svg>
  );
}

InfoIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string
};

function CategoryIcon({ index, className }) {
  const icons = [
    <path key="cat-icon-0" fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>,
    <path key="cat-icon-1" d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"></path>,
    <path key="cat-icon-2" fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"></path>,
  ];
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      {icons[index] || <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>}
    </svg>
  );
}

CategoryIcon.propTypes = {
  index: PropTypes.number.isRequired,
  className: PropTypes.string
}; 