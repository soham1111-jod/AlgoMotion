import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Register service worker for production
if ('serviceWorker' in navigator && import.meta.env.MODE === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Lazy load components for better performance
const App = lazy(() => import('./App'))
const Visualizer = lazy(() => import('./components/pages/Visualizer'))
const RaceMode = lazy(() => import('./components/pages/RaceMode'))
const Home = lazy(() => import('./components/pages/Home'))

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading visualization...</p>
    </div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'visualizer',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Visualizer />
          </Suspense>
        )
      },
      {
        path: 'race',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RaceMode />
          </Suspense>
        )
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
