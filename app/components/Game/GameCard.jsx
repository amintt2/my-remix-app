import PropTypes from 'prop-types';

export default function GameCard({ game, variant = 'standard' }) {
  const isLarge = variant === 'featured';
  
  return (
    <div 
      className={`
        relative rounded-lg overflow-hidden ${game.color} 
        ${isLarge ? 'h-40 sm:h-48 md:h-52' : 'h-28 sm:h-32 md:h-36'} 
        w-full cursor-pointer transition-transform duration-200 ease-in-out 
        hover:scale-105 border border-transparent hover:border-gray-600 group
      `}
    >
      {/* Game thumbnail with progressive loading (placeholder until loaded) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-75 transition-opacity">
        <span className="text-white font-bold text-xl">{game.title.substring(0, 1)}</span>
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
            transition duration-200 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Quick play: ${game.title}`);
          }}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    featured: PropTypes.bool
  }).isRequired,
  variant: PropTypes.oneOf(['standard', 'featured'])
}; 