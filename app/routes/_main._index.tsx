import type { MetaFunction } from "@remix-run/node";
import GameGrid from "~/components/Game/GameGrid";

export const meta: MetaFunction = () => {
  return [
    { title: "CrazyGames - Jeux en ligne gratuits" },
    { name: "description", content: "Joue à des jeux en ligne gratuits sur CrazyGames. Nous proposons les meilleurs jeux gratuits." },
  ];
};

export default function Index() {
  return <GameGrid />;
} 