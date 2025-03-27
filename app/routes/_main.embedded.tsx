import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gameService, Game } from "~/services/gameService";
import { useGameContext } from "~/contexts/GameContext";
import GameCard from "~/components/Game/GameCard";

export function loader() {
  const embeddedGames = gameService.getEmbeddedGames();
  return json({ embeddedGames });
}

export default function EmbeddedGames() {
  const { embeddedGames } = useLoaderData<typeof loader>();
  const { isGameFavorite, addToFavorites, removeFromFavorites } = useGameContext();
  
  const handleFavoriteToggle = (game: Game) => {
    if (isGameFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Embedded Games</h1>
        <p className="text-gray-400">
          These games can be played directly in your browser without any downloads or installations.
          Enjoy seamless gaming with these specially integrated games!
        </p>
      </div>
      
      <div className="bg-gray-800/40 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-bold text-white">Instant Play Games</h2>
        </div>
        <p className="text-gray-300 mb-6">
          These games feature special integration that allows them to run directly in your browser.
          Just click &quot;Play Now&quot; and start having fun immediately - no waiting, no downloads, no installations!
        </p>
      </div>
      
      {embeddedGames.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">No embedded games found. Check back later for new additions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {embeddedGames.map(game => (
            <div key={game.id} className="relative">
              <div className="absolute z-10 inset-0 opacity-0 pointer-events-none">
                <img 
                  src={game.image} 
                  alt="" 
                  className="h-0 w-0"
                  onLoad={() => {
                    const img = new Image();
                    img.src = game.image || '';
                  }}
                />
              </div>
              <GameCard game={game} />
              <button 
                onClick={() => handleFavoriteToggle(game)}
                className="absolute top-2 right-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 p-1.5 rounded-full"
              >
                <svg className={`w-4 h-4 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">About Embedded Games</h3>
        <div className="text-gray-300 space-y-4">
          <p>
            Embedded games are HTML5 games that run directly in your browser. They use modern web technologies
            to provide a smooth gaming experience without requiring any plugins or installations.
          </p>
          <p>
            These games typically load faster and can be played on almost any device with a modern web browser,
            including smartphones, tablets, and computers.
          </p>
          <p>
            Our embedded games are sourced from trusted partners and game developers who specialize in creating
            high-quality HTML5 content. We regularly update our collection with new games, so check back often!
          </p>
        </div>
      </div>
    </div>
  );
} 