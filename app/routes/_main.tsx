import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/Layout/Sidebar";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <div className="ml-20 flex-1 flex flex-col max-h-screen">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
} 