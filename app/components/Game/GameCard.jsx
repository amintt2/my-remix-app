import PropTypes from 'prop-types';
import { Link } from '@remix-run/react';
import { useState } from 'react';

export default function GameCard({ game, variant = 'standard' }) {
  const isLarge = variant === 'featured';
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Link 
      to={`/games/${game.id}`}
      className={`
        relative rounded-lg overflow-hidden ${game.color} 
        ${isLarge ? 'h-40 sm:h-48 md:h-52' : 'h-28 sm:h-32 md:h-36'} 
        w-full cursor-pointer transition-transform duration-200 ease-in-out 
        hover:scale-105 border border-transparent hover:border-gray-600 group block
      `}
    >
      {/* Game thumbnail with progressive loading (placeholder until loaded) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {game.image && !imageError ? (
          <img 
            src={game.image} 
            alt={game.title} 
            className="w-full h-full object-cover transform transition-transform duration-200 group-hover:scale-110"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${game.color}`}>
            <span className="text-white font-bold text-xl">{game.title.substring(0, 1)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-10 transition-opacity"></div>
      </div>
      
      {/* Game title with gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full p-2 pt-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <div className="text-white font-semibold text-sm md:text-base truncate">{game.title}</div>
      </div>
      
      {/* Popular badge (conditional rendering) */}
      {game.featured && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded shadow">
          POPULAIRE
        </div>
      )}
      
      {/* Quick play button overlay (appears on hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-full 
            transition duration-200 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          aria-label="Play Now"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play Now
        </button>
      </div>
    </Link>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    featured: PropTypes.bool,
    image: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['standard', 'featured'])
}; 