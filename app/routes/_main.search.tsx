import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useGameContext } from "~/contexts/GameContext";
import GameCard from "~/components/Game/GameCard";
import { gameService, type Game } from "~/services/gameService";

export const meta: MetaFunction = () => {
  return [
    { title: "Recherche de jeux - CrazyGames" },
    { name: "description", content: "Trouvez vos jeux préférés sur CrazyGames." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  
  const games = q ? gameService.searchGames(q) : [];
  const popularGames = gameService.getPopularGames().slice(0, 5);
  
  return json({ games, query: q, popularGames });
}

export default function SearchResults() {
  const { games, query, popularGames } = useLoaderData<typeof loader>();
  const { isGameFavorite, addToFavorites, removeFromFavorites } = useGameContext();

  const handleFavoriteToggle = (game: Game) => {
    if (isGameFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 text-indigo-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <h1 className="text-2xl font-bold text-white">
          {query ? `Résultats pour "${query}"` : "Recherche"}
        </h1>
      </div>
      
      {query && games.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Aucun jeu trouvé</h2>
          <p className="text-gray-400 mb-6">Nous n&apos;avons pas trouvé de jeux correspondant à &quot;{query}&quot;</p>
          <div className="flex justify-center">
            <a href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
              Retourner à l&apos;accueil
            </a>
          </div>
        </div>
      ) : (
        <>
          {games.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">
                {games.length} {games.length === 1 ? 'résultat' : 'résultats'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {games.map(game => (
                  <div key={game.id} className="relative">
                    <GameCard game={game} variant={game.featured ? "featured" : "standard"} />
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
            </div>
          )}
          
          {(!query || games.length === 0) && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">Jeux populaires</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularGames.map(game => (
                  <div key={game.id} className="relative">
                    <GameCard game={game} variant={game.featured ? "featured" : "standard"} />
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
            </div>
          )}
        </>
      )}
    </div>
  );
} 