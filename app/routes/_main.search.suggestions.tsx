import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { gameService } from "~/services/gameService";

/**
 * API endpoint for providing search suggestions 
 * Returns a list of game titles that match the query
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  
  if (!q || q.length < 2) {
    return json({ suggestions: [] });
  }
  
  // Search for games matching the query
  const games = gameService.searchGames(q);
  
  // Extract titles for suggestions (limited to 8 results)
  const suggestions = games
    .slice(0, 8)
    .map(game => ({
      id: game.id,
      title: game.title,
      image: game.image,
      category: game.category?.[0] || "game"
    }));
  
  return json({ suggestions });
} 