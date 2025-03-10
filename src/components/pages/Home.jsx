import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Data Structures & Algorithms Visualizer
        </h1>
        
        <div className="bg-muted p-6 rounded-lg mb-8">
          <p className="text-lg mb-4">
            Welcome to the DSA Visualizer! This interactive tool helps you understand how different algorithms work through step-by-step visualizations.
          </p>
          <p className="mb-4">
            Choose from the following modes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Link 
              to="/visualizer" 
              className="flex flex-col items-center p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-indigo-900/30 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 dark:border-indigo-900/30"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Algorithm Visualizer</h2>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Watch algorithms in action with step-by-step visualization and detailed explanations.
              </p>
              <div className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 transition-all duration-200">
                Start Visualizing
              </div>
            </Link>
            
            <Link 
              to="/race" 
              className="flex flex-col items-center p-6 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-emerald-900/30 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 dark:border-emerald-900/30"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 dark:from-emerald-500 dark:to-green-700 rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Algorithm Race</h2>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Compare the performance of different algorithms side by side to see which one is faster.
              </p>
              <div className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white rounded-md hover:from-emerald-600 hover:to-green-700 dark:hover:from-emerald-700 dark:hover:to-green-800 transition-all duration-200">
                Start Racing
              </div>
            </Link>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>How sorting algorithms like Bubble Sort, Quick Sort, and Merge Sort work</li>
            <li>Visualization of graph traversal algorithms like BFS and DFS</li>
            <li>Performance comparison between different algorithms</li>
            <li>Step-by-step execution with detailed explanations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
  