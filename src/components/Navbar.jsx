import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import "./Navbar.css"; // Import the new CSS file

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 sm:p-3 bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-30 lg:static border-b border-gray-200 dark:border-gray-700 h-16 w-full overflow-x-hidden">
            <div className="flex items-center overflow-hidden">
                <Link to="/" className="text-xl sm:text-lg font-bold text-blue-600 dark:text-blue-400 ml-10 sm:ml-8 transition-all duration-300">
                    DSA Visualizer
                </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
                <a 
                    href="https://github.com/soham1111-jod/ds-algo-visualizer_nexus_project_sohamchafale" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github sm:w-5 sm:h-5">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span className="hidden sm:inline text-sm sm:text-base">GitHub</span>
                </a>
                <div className="scale-90 sm:scale-100">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
