import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useGameContext } from "~/contexts/GameContext";
import GameCard from "~/components/Game/GameCard";
import { gameService, type Game } from "~/services/gameService";

export const meta: MetaFunction = () => {
  return [
    { title: "Jeux Tendance - CrazyGames" },
    { name: "description", content: "Découvrez les jeux tendance du moment sur CrazyGames." },
  ];
};

export async function loader() {
  const games = gameService.getTrendingGames();
  return json({ games });
}

export default function TrendingGames() {
  const { games } = useLoaderData<typeof loader>();
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
        <svg className="w-6 h-6 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
        </svg>
        <h1 className="text-2xl font-bold text-white">Jeux Tendance</h1>
      </div>
      
      <div className="mb-6 px-4 py-3 bg-gray-800/70 rounded-lg">
        <p className="text-gray-300">Les jeux les plus joués du moment ! Découvrez ce qui est populaire dans la communauté.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map(game => (
          <div key={game.id} className="relative">
            <GameCard game={game} variant={game.featured ? "featured" : "standard"} />
            <div className="absolute top-2 left-2 z-10 bg-pink-500/90 text-white text-xs font-medium px-2 py-1 rounded">
              {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(game.plays || 0)} joueurs
            </div>
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
      
      <div className="mt-8 flex justify-center">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors">
          Charger plus de jeux
        </button>
      </div>
    </div>
  );
} 