import { useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useGameContext } from "~/contexts/GameContext";
import { gameService } from "~/services/gameService";
import EmbedWrapper from "~/components/Game/EmbedWrapper";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.game) {
    return [
      { title: "Game Not Found - CrazyGames" },
      { name: "description", content: "The requested game could not be found." },
    ];
  }
  
  return [
    { title: `${data.game.title} - Play Now on CrazyGames` },
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
    .slice(0, 6);
  
  return json({ game, relatedGames });
}

export default function GameDetail() {
  const { game, relatedGames } = useLoaderData<typeof loader>();
  const { addToPlayHistory, isGameFavorite, addToFavorites, removeFromFavorites } = useGameContext();
  const navigate = useNavigate();
  
  // Add game to play history when the component mounts
  addToPlayHistory(game);
  
  const handleFavoriteToggle = () => {
    if (isGameFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle navigation with direct URL approach
  const handleNavigate = (path: string) => {
    // Use direct window.location approach for reliable navigation
    window.location.href = path;
  };

  // Format the category names for display
  const formattedCategories = game.category?.map(cat => {
    const capitalized = cat.charAt(0).toUpperCase() + cat.slice(1);
    return capitalized;
  }).join(', ');
  
  // Extract tags if available
  const tags = game.tags ? game.tags.split(',').map(tag => tag.trim()) : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={handleGoBack}
        className="mb-4 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game preview and embed section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-8">
            {/* Game preview image and details */}
            <div className={`relative aspect-video ${game.color} flex items-center justify-center`}>
              {game.image ? (
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const placeholder = document.createElement('span');
                      placeholder.className = "text-white text-6xl font-bold opacity-50";
                      placeholder.textContent = game.title.substring(0, 1);
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              ) : (
                <span className="text-white text-6xl font-bold opacity-50">{game.title.substring(0, 1)}</span>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.category?.map(category => (
                      <button 
                        key={category} 
                        onClick={() => handleNavigate(`/${category}`)}
                        className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-1 rounded-full transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Game actions */}
            <div className="p-6 flex flex-wrap items-center gap-4">
              <button 
                onClick={handleFavoriteToggle}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className={`w-5 h-5 ${isGameFavorite(game.id) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {isGameFavorite(game.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-bold">{game.rating}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-white">{game.plays?.toLocaleString() || 0} plays</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game embed container */}
          <div className="aspect-video mb-8 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
            <EmbedWrapper game={game} />
          </div>
          
          {/* Game description */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-3">About this game</h2>
            <p className="text-gray-300 mb-6 whitespace-pre-line">{game.description}</p>
            
            {/* Game tags */}
            {tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Controls - placeholder, would show actual controls in a real implementation */}
            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Controls</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
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
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Game information card */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Game Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Category</h3>
                  <p className="text-white">{formattedCategories || 'Uncategorized'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Rating</h3>
                  <div className="flex items-center">
                    <span className="text-white mr-2">{game.rating}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${star <= Math.round(game.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Status</h3>
                  <div className="flex items-center gap-2">
                    {game.new && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                    {game.featured && (
                      <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">Featured</span>
                    )}
                    {!game.new && !game.featured && (
                      <span className="text-white">Regular</span>
                    )}
                  </div>
                </div>
                
                {/* Game stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Stats</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Plays</div>
                      <div className="text-white font-bold">{game.plays?.toLocaleString() || 0}</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Added</div>
                      <div className="text-white font-bold">{game.new ? "Recently" : "Earlier"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related games */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Similar Games</h2>
              <div className="space-y-3">
                {relatedGames.map(relatedGame => (
                  <button 
                    key={relatedGame.id}
                    onClick={() => handleNavigate(`/games/${relatedGame.id}`)}
                    className="block w-full bg-gray-700 hover:bg-gray-600 rounded-lg overflow-hidden transition-colors text-left"
                  >
                    <div className="flex items-center">
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
                                const placeholder = document.createElement('span');
                                placeholder.className = "text-white font-bold text-xl";
                                placeholder.textContent = relatedGame.title.substring(0, 1);
                                parent.appendChild(placeholder);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-white font-bold text-xl">{relatedGame.title.substring(0, 1)}</span>
                        )}
                      </div>
                      <div className="p-3 flex-1">
                        <div className="text-white font-semibold">{relatedGame.title}</div>
                        <div className="flex items-center text-sm text-gray-400">
                          <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {relatedGame.rating || "N/A"}
                        </div>
                      </div>
                      <div className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-full flex items-center">
                        Play
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Link to embedded games */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button 
                  onClick={() => handleNavigate('/embedded')}
                  className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-colors"
                >
                  <div>
                    <h3 className="font-bold">Embedded Games</h3>
                    <p className="text-sm text-indigo-200">Play games that load instantly</p>
                  </div>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 