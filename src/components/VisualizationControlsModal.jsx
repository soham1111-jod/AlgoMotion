import React, { useEffect, useRef } from 'react';

export const VisualizationControlsModal = ({
  isOpen,
  onClose,
  animationStyle,
  setAnimationStyle,
  colorTheme,
  setColorTheme,
  elementSize,
  setElementSize,
  showHistory,
  setShowHistory
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      // Prevent scrolling of background content
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        // Close when clicking outside the modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 id="modal-title" className="text-xl font-semibold">Visualization Settings</h2>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Animation Style */}
          <div role="radiogroup" aria-labelledby="animation-style-label">
            <label id="animation-style-label" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Animation Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                role="radio"
                aria-checked={animationStyle === 'default'}
                className={`p-3 rounded-lg border ${
                  animationStyle === 'default' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setAnimationStyle('default')}
              >
                <div className="text-center">
                  <div className="h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                  <div className="mt-1 text-sm font-medium">Default</div>
                </div>
              </button>
              
              <button
                role="radio"
                aria-checked={animationStyle === 'smooth'}
                className={`p-3 rounded-lg border ${
                  animationStyle === 'smooth' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setAnimationStyle('smooth')}
              >
                <div className="text-center">
                  <div className="h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="mt-1 text-sm font-medium">Smooth</div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Color Theme */}
          <div>
            <label id="color-theme-label" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Color Theme
            </label>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-labelledby="color-theme-label">
              <button
                role="radio"
                aria-checked={colorTheme === 'blue'}
                aria-label="Blue theme"
                className={`p-2 rounded-lg border ${
                  colorTheme === 'blue' 
                    ? 'border-blue-500 ring-2 ring-blue-500/30' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setColorTheme('blue')}
              >
                <div className="h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md"></div>
                <div className="mt-1 text-xs text-center font-medium">Blue</div>
              </button>
              
              <button
                role="radio"
                aria-checked={colorTheme === 'green'}
                aria-label="Green theme"
                className={`p-2 rounded-lg border ${
                  colorTheme === 'green' 
                    ? 'border-blue-500 ring-2 ring-blue-500/30' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setColorTheme('green')}
              >
                <div className="h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-md"></div>
                <div className="mt-1 text-xs text-center font-medium">Green</div>
              </button>
              
              <button
                role="radio"
                aria-checked={colorTheme === 'purple'}
                aria-label="Purple theme"
                className={`p-2 rounded-lg border ${
                  colorTheme === 'purple' 
                    ? 'border-blue-500 ring-2 ring-blue-500/30' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setColorTheme('purple')}
              >
                <div className="h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md"></div>
                <div className="mt-1 text-xs text-center font-medium">Purple</div>
              </button>
              
              <button
                role="radio"
                aria-checked={colorTheme === 'rainbow'}
                aria-label="Rainbow theme"
                className={`p-2 rounded-lg border ${
                  colorTheme === 'rainbow' 
                    ? 'border-blue-500 ring-2 ring-blue-500/30' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setColorTheme('rainbow')}
              >
                <div className="h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-md"></div>
                <div className="mt-1 text-xs text-center font-medium">Rainbow</div>
              </button>
            </div>
          </div>
          
          {/* Element Size */}
          <div>
            <label htmlFor="element-size" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Element Size
            </label>
            <div className="flex items-center gap-4">
              <input
                id="element-size"
                type="range"
                min="1"
                max="10"
                value={elementSize}
                onChange={(e) => setElementSize(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                aria-valuemin="1"
                aria-valuemax="10"
                aria-valuenow={elementSize}
              />
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {elementSize}
              </span>
            </div>
          </div>
          
          {/* Show History */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-history"
              checked={showHistory}
              onChange={(e) => setShowHistory(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="show-history" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Show Step History
            </label>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 