import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useGameContext } from "~/contexts/GameContext";
import { gameService } from "~/services/gameService";
import EmbedWrapper from "~/components/Game/EmbedWrapper";
import { useEffect, useState } from "react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.game) {
    return [
      { title: "Game Not Found - CrazyGames" },
      { name: "description", content: "The requested game could not be found." },
    ];
  }
  
  return [
    { title: `Play ${data.game.title} - CrazyGames` },
    { name: "description", content: data.game.description || `Play ${data.game.title} online for free on CrazyGames.` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const gameId = params.gameId;
  
  if (!gameId) {
    throw new Response("Game ID is required", { status: 400 });
  }
  
  const game = gameService.getGameById(gameId);
  
  if (!game) {
    throw new Response("Game not found", { status: 404 });
  }
  
  // Get related games in the same category
  const primaryCategory = game.category?.[0] || "popular";
  const relatedGames = gameService.getGamesByCategory(primaryCategory)
    .filter(g => g.id !== game.id)
    .slice(0, 5);
  
  return json({ game, relatedGames });
}

export default function GameDetail() {
  const { game, relatedGames } = useLoaderData<typeof loader>();
  const { addToPlayHistory, isGameFavorite, addToFavorites, removeFromFavorites } = useGameContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPlayPage = searchParams.get('from') === 'play';
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add the game to play history when the component mounts
    addToPlayHistory(game);
    
    // Redirect to play page if not coming from there
    if (!fromPlayPage) {
      navigate(`/play/${game.id}`, { replace: true });
    } else {
      // If coming from play page, show loading indicator briefly
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [game, addToPlayHistory, fromPlayPage, navigate]);
  
  const handleFavoriteToggle = () => {
    if (isGameFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };
  
  if (!fromPlayPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mr-3"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">{game.title}</h1>
        <button 
          onClick={handleFavoriteToggle}
          className="ml-auto flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <svg className={`w-5 h-5 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{isGameFavorite(game.id) ? 'Favorited' : 'Add to Favorites'}</span>
        </button>
      </div>
      
      {/* Game embed container with loading state */}
      <div className="aspect-video mb-8 rounded-lg overflow-hidden border border-gray-700 shadow-lg relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-white">Chargement du jeu...</p>
            </div>
          </div>
        ) : null}
        <EmbedWrapper game={game} />
      </div>
      
      {/* Game info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-3">À propos du jeu</h2>
          <p className="text-gray-300 mb-6 whitespace-pre-line">{game.description}</p>
          
          {/* Game stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Plays</div>
              <div className="text-white font-bold">{game.plays?.toLocaleString() || 0}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Rating</div>
              <div className="text-white font-bold flex items-center">
                {game.rating || "N/A"}
                {game.rating && (
                  <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Added</div>
              <div className="text-white font-bold">{game.new ? "Recently" : "Earlier"}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Featured</div>
              <div className="text-white font-bold">{game.featured ? "Yes" : "No"}</div>
            </div>
          </div>
          
          {/* Game tags if available */}
          {game.tags && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.split(',').map(tag => (
                  <span 
                    key={tag.trim()} 
                    className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Controls - placeholder, would show actual controls in a real implementation */}
          <h3 className="text-lg font-semibold text-white mb-2">Controls</h3>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">Move</div>
              <div className="text-white">WASD or Arrow Keys</div>
              <div className="text-gray-300">Action</div>
              <div className="text-white">Space / Left Click</div>
              <div className="text-gray-300">Menu</div>
              <div className="text-white">Escape</div>
            </div>
          </div>
        </div>
        
        {/* Related games sidebar */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Games similaires</h2>
          <div className="space-y-4">
            {relatedGames.map(relatedGame => (
              <div key={relatedGame.id} className="bg-gray-800 rounded-lg overflow-hidden flex items-center">
                <div className={`w-16 h-16 ${relatedGame.color} flex-shrink-0 flex items-center justify-center`}>
                  {relatedGame.image ? (
                    <img 
                      src={relatedGame.image} 
                      alt={relatedGame.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-white font-bold text-xl">${relatedGame.title.substring(0, 1)}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-xl">{relatedGame.title.substring(0, 1)}</span>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-white font-semibold">{relatedGame.title}</div>
                  <div className="flex items-center text-sm text-gray-400">
                    <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {relatedGame.rating || "N/A"}
                  </div>
                </div>
                <a 
                  href={`/play/${relatedGame.id}`}
                  className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 h-full flex items-center"
                >
                  Play
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 