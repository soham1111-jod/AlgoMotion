// components/SpeedControl.jsx
import React, { memo, useMemo } from 'react';

const SpeedControl = ({ speed, setSpeed }) => {
  // Invert the speed value for the slider
  // Original speed: 10 (slow) to 2000 (fast)
  // Inverted slider: 10 (slow) to 2000 (fast)
  const sliderValue = useMemo(() => speed, [speed]);
  
  // Calculate percentage for the slider (higher value = more blue)
  const fastPercentage = useMemo(() => {
    return Math.max(0, Math.min(100, ((sliderValue - 10) / 1990) * 100));
  }, [sliderValue]);
  
  // Handle slider change
  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    setSpeed(newSpeed);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-md w-full sm:w-auto border border-gray-200 dark:border-gray-700 shadow-sm">
      <span className="text-sm font-medium mr-1">Speed:</span>
      <div className="flex items-center flex-1 min-w-[180px]">
        <span id="speed-slow" className="mr-2 text-xs font-medium text-gray-500 dark:text-gray-400">Slow</span>
        <div className="relative flex-1 h-6 flex items-center mx-1">
          <input
            type="range"
            min="10"
            max="2000"
            step="10"
            value={sliderValue}
            onChange={handleSpeedChange}
            className="w-full h-2 appearance-none bg-transparent cursor-pointer z-10 absolute opacity-0"
            aria-valuemin="10"
            aria-valuemax="2000"
            aria-valuenow={sliderValue}
            aria-labelledby="speed-slow speed-fast"
          />
          <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-full transition-all duration-200" 
              style={{ width: `${fastPercentage}%` }}
            />
          </div>
        </div>
        <span id="speed-fast" className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">Fast</span>
      </div>
      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap" aria-live="polite">
        {sliderValue}
      </span>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MemoizedSpeedControl = memo(SpeedControl);
export { SpeedControl };