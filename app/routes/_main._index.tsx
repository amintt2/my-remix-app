import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useGameContext } from "~/contexts/GameContext";
import { gameService, type Game } from "~/services/gameService";
import GameGrid from "~/components/Game/GameGrid";

export const meta: MetaFunction = () => {
  return [
    { title: "CrazyGames - Jeux en ligne gratuits" },
    { name: "description", content: "Joue à des jeux en ligne gratuits sur CrazyGames. Nous proposons les meilleurs jeux gratuits." },
  ];
};

export async function loader() {
  const popularGames = gameService.getPopularGames().slice(0, 10);
  const trendingGames = gameService.getTrendingGames().slice(0, 10);
  
  return json({
    popularGames,
    trendingGames
  });
}

export default function Index() {
  const { popularGames, trendingGames } = useLoaderData<typeof loader>();
  const { isGameFavorite, addToFavorites, removeFromFavorites } = useGameContext();
  
  const handleFavoriteToggle = (game: Game) => {
    if (isGameFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };
  
  return (
    <div>
      <GameGrid />
      
      {/* Additional Popular and Trending sections */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popular Games Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-lg font-bold text-white">Jeux Populaires</h2>
              </div>
              <Link to="/popular" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Voir plus
              </Link>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-4">
              <div className="grid grid-cols-1 gap-3">
                {popularGames.map(game => (
                  <div key={game.id} className="relative flex bg-gray-800/60 rounded-lg overflow-hidden hover:bg-gray-700/60 transition-colors">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={game.image || '/images/placeholder.jpg'} 
                        alt={game.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-2 flex-1">
                      <h3 className="text-white font-medium">{game.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{game.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {game.rating}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFavoriteToggle(game)}
                      className="absolute top-2 right-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 p-1.5 rounded-full"
                    >
                      <svg className={`w-3 h-3 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Trending Games Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-lg font-bold text-white">Jeux Tendance</h2>
              </div>
              <Link to="/trending" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Voir plus
              </Link>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-4">
              <div className="grid grid-cols-1 gap-3">
                {trendingGames.map(game => (
                  <div key={game.id} className="relative flex bg-gray-800/60 rounded-lg overflow-hidden hover:bg-gray-700/60 transition-colors">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={game.image || '/images/placeholder.jpg'} 
                        alt={game.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-2 flex-1">
                      <h3 className="text-white font-medium">{game.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="bg-pink-500/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(game.plays || 0)} joueurs
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-1">{game.description}</p>
                    </div>
                    <button 
                      onClick={() => handleFavoriteToggle(game)}
                      className="absolute top-2 right-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 p-1.5 rounded-full"
                    >
                      <svg className={`w-3 h-3 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 