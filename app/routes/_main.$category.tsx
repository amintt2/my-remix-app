import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useGameContext } from "~/contexts/GameContext";
import GameCard from "~/components/Game/GameCard";
import { gameService, type Game } from "~/services/gameService";

// Category configuration data
const CATEGORY_CONFIG = {
  action: {
    title: "Jeux d'Action",
    description: "Découvrez les meilleurs jeux d'action sur CrazyGames.",
    icon: "M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z",
    color: "text-red-500"
  },
  adventure: {
    title: "Jeux d'Aventure",
    description: "Découvrez les meilleurs jeux d'aventure sur CrazyGames.",
    icon: "M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    color: "text-green-500"
  },
  clicker: {
    title: "Jeux de Clicker",
    description: "Découvrez les meilleurs jeux de clicker sur CrazyGames.",
    icon: "M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z",
    color: "text-orange-500"
  },
  io: {
    title: "Jeux .io",
    description: "Découvrez les meilleurs jeux .io sur CrazyGames.",
    icon: "M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z",
    color: "text-violet-500"
  },
  new: {
    title: "Nouveaux Jeux",
    description: "Découvrez les nouveaux jeux ajoutés récemment sur CrazyGames.",
    icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z",
    color: "text-green-400"
  },
  popular: {
    title: "Jeux Populaires",
    description: "Découvrez les jeux les plus populaires sur CrazyGames.",
    icon: "M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z",
    color: "text-indigo-400"
  },
  puzzle: {
    title: "Jeux de Puzzle",
    description: "Découvrez les meilleurs jeux de puzzle sur CrazyGames.",
    icon: "M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z",
    color: "text-purple-500"
  },
  racing: {
    title: "Jeux de Course",
    description: "Découvrez les meilleurs jeux de course sur CrazyGames.",
    icon: "M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z\nM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-5h2v5a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V9a3 3 0 00-3-3h-3V4a1 1 0 00-1-1H3z",
    color: "text-green-500"
  },
  shooting: {
    title: "Jeux de Tir",
    description: "Découvrez les meilleurs jeux de tir sur CrazyGames.",
    icon: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z",
    color: "text-red-500"
  },
  simulation: {
    title: "Jeux de Simulation",
    description: "Découvrez les meilleurs jeux de simulation sur CrazyGames.",
    icon: "M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z",
    color: "text-cyan-500"
  },
  sports: {
    title: "Jeux de Sports",
    description: "Découvrez les meilleurs jeux de sports sur CrazyGames.",
    icon: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
    color: "text-blue-500"
  },
  strategy: {
    title: "Jeux de Stratégie",
    description: "Découvrez les meilleurs jeux de stratégie sur CrazyGames.",
    icon: "M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z",
    color: "text-amber-500"
  },
  trending: {
    title: "Jeux Tendance",
    description: "Découvrez les jeux tendance du moment sur CrazyGames.",
    icon: "M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z",
    color: "text-pink-500"
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Catégorie introuvable - CrazyGames" },
      { name: "description", content: "La catégorie demandée n'existe pas." },
    ];
  }
  
  return [
    { title: data.category.title + " - CrazyGames" },
    { name: "description", content: data.category.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const category = params.category;
  
  if (!category || !(category in CATEGORY_CONFIG)) {
    throw new Response("Catégorie introuvable", { status: 404 });
  }
  
  const categoryConfig = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  
  let games: Game[];
  switch(category) {
    case 'new':
      games = gameService.getNewGames();
      break;
    case 'popular':
      games = gameService.getPopularGames();
      break;
    case 'trending':
      games = gameService.getTrendingGames();
      break;
    default:
      games = gameService.getGamesByCategory(category);
  }
  
  return json({
    games,
    category: categoryConfig,
    categorySlug: category
  });
}

export default function CategoryGames() {
  const { games, category: categoryConfig, categorySlug } = useLoaderData<typeof loader>();
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
        <svg className={`w-6 h-6 ${categoryConfig.color} mr-2`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d={categoryConfig.icon} clipRule="evenodd"></path>
        </svg>
        <h1 className="text-2xl font-bold text-white">{categoryConfig.title}</h1>
      </div>
      
      {categorySlug === 'trending' && (
        <div className="mb-6 px-4 py-3 bg-gray-800/70 rounded-lg">
          <p className="text-gray-300">Les jeux les plus joués du moment ! Découvrez ce qui est populaire dans la communauté.</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map(game => (
          <div key={game.id} className="relative">
            {categorySlug === 'new' && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-tr-md rounded-bl-md z-10">
                NOUVEAU
              </div>
            )}
            {categorySlug === 'trending' && (
              <div className="absolute top-2 left-2 z-10 bg-pink-500/90 text-white text-xs font-medium px-2 py-1 rounded">
                {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(game.plays || 0)} joueurs
              </div>
            )}
            <GameCard game={game} variant={game.featured ? "featured" : "standard"} />
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