import type { MetaFunction } from "@remix-run/node";
import GameGrid from "~/components/Game/GameGrid";
import Sidebar from "~/components/Layout/Sidebar";
import Footer from "~/components/Layout/Footer";
import Header from "~/components/Layout/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "CrazyGames - Jeux en ligne gratuits" },
    { name: "description", content: "Joue à des jeux en ligne gratuits sur CrazyGames. Nous proposons les meilleurs jeux gratuits." },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="ml-20 flex-1 flex flex-col max-h-screen">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <GameGrid />
          <Footer />
        </div>
      </div>
    </div>
  );
}
