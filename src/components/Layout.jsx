import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="p-4 pt-16 lg:pt-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
