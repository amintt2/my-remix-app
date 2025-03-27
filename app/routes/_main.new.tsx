import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useGameContext } from "~/contexts/GameContext";
import GameCard from "~/components/Game/GameCard";
import { gameService, type Game } from "~/services/gameService";

export const meta: MetaFunction = () => {
  return [
    { title: "Nouveaux Jeux - CrazyGames" },
    { name: "description", content: "Découvrez les nouveaux jeux ajoutés récemment sur CrazyGames." },
  ];
};

export async function loader() {
  const games = gameService.getNewGames();
  return json({ games });
}

export default function NewGames() {
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
        <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
        </svg>
        <h1 className="text-2xl font-bold text-white">Nouveaux Jeux</h1>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map(game => (
          <div key={game.id} className="relative">
            <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-tr-md rounded-bl-md z-10">
              NOUVEAU
            </div>
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
      
      <div className="mt-8 flex justify-center">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors">
          Charger plus de jeux
        </button>
      </div>
    </div>
  );
} 