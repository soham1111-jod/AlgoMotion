import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, BarChart2, PlayCircle, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button - moved to left edge */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-2 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-40 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'w-64' : 'w-0 lg:w-64'
        } lg:static`}
      >
        <div className="w-64">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Menu</span>
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 py-4">
            <SidebarLink to="/" icon={<Home size={16} />} label="Home" onClick={toggleSidebar} />
            <SidebarLink to="/visualizer" icon={<BarChart2 size={16} />} label="Visualizer" onClick={toggleSidebar} />
            <SidebarLink to="/race" icon={<PlayCircle size={16} />} label="Algorithm Race" onClick={toggleSidebar} />
          </nav>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm sm:text-base"
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
