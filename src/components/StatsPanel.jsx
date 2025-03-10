import React, { useMemo } from 'react';

export const StatsPanel = React.memo(({ algorithm, arraySize, steps, currentStep }) => {
  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return Math.round(num).toString();
  };

  // Memoize metrics calculation to prevent unnecessary recalculations
  const metrics = useMemo(() => {
    // These are simplified metrics for demonstration
    // In a real app, you would calculate these from actual algorithm execution
    const algorithmMetrics = {
      bubble: {
        comparisons: Math.min(currentStep * 2, arraySize * arraySize),
        swaps: Math.min(currentStep, arraySize * arraySize / 2),
        accesses: Math.min(currentStep * 3, arraySize * arraySize * 2),
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
      },
      quick: {
        comparisons: Math.min(currentStep * 1.5, arraySize * Math.log2(arraySize)),
        swaps: Math.min(currentStep * 0.5, arraySize * Math.log2(arraySize) / 3),
        accesses: Math.min(currentStep * 2, arraySize * Math.log2(arraySize) * 2),
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)'
      },
      merge: {
        comparisons: Math.min(currentStep, arraySize * Math.log2(arraySize)),
        swaps: 0, // Merge sort doesn't swap in-place
        accesses: Math.min(currentStep * 3, arraySize * Math.log2(arraySize) * 2),
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)'
      },
      selection: {
        comparisons: Math.min(currentStep * 2, arraySize * arraySize),
        swaps: Math.min(currentStep * 0.2, arraySize),
        accesses: Math.min(currentStep * 2, arraySize * arraySize + arraySize),
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
      },
      insertion: {
        comparisons: Math.min(currentStep, arraySize * arraySize / 2),
        swaps: Math.min(currentStep, arraySize * arraySize / 2),
        accesses: Math.min(currentStep * 3, arraySize * arraySize),
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
      },
      linear: {
        comparisons: Math.min(currentStep, arraySize),
        swaps: 0,
        accesses: Math.min(currentStep, arraySize),
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
      },
      binary: {
        comparisons: Math.min(currentStep, Math.log2(arraySize)),
        swaps: 0,
        accesses: Math.min(currentStep, Math.log2(arraySize)),
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
      },
      bfs: {
        comparisons: Math.min(currentStep * 2, arraySize * 2),
        swaps: 0,
        accesses: Math.min(currentStep * 3, arraySize * 3),
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)'
      },
      dfs: {
        comparisons: Math.min(currentStep * 2, arraySize * 2),
        swaps: 0,
        accesses: Math.min(currentStep * 3, arraySize * 3),
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)'
      },
      fibonacci: {
        comparisons: currentStep,
        swaps: 0,
        accesses: currentStep * 2,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
      },
      gcd: {
        comparisons: currentStep,
        swaps: 0,
        accesses: currentStep * 2,
        timeComplexity: 'O(log min(a,b))',
        spaceComplexity: 'O(1)'
      }
    };

    return algorithmMetrics[algorithm] || {
      comparisons: 0,
      swaps: 0,
      accesses: 0,
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A'
    };
  }, [algorithm, arraySize, currentStep]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return steps > 0 ? Math.min(100, Math.round((currentStep / (steps - 1)) * 100)) : 0;
  }, [currentStep, steps]);

  return (
    <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="text-lg font-semibold mb-3">Algorithm Stats</h2>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span aria-live="polite" aria-atomic="true">{progressPercentage}%</span>
        </div>
        <div 
          className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          role="progressbar" 
          aria-valuenow={progressPercentage} 
          aria-valuemin="0" 
          aria-valuemax="100"
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Current step */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Step</div>
          <div className="font-mono text-lg">
            <span aria-live="polite">{currentStep}</span> 
            <span className="text-gray-400 text-sm">/ {steps - 1}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Array Size</div>
          <div className="font-mono text-lg">{arraySize}</div>
        </div>
      </div>
      
      {/* Complexity */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time Complexity</div>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
            {metrics.timeComplexity}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Space Complexity</div>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
            {metrics.spaceComplexity}
          </div>
        </div>
      </div>
      
      {/* Operation counts */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Comparisons</div>
          <div className="font-mono text-lg" aria-live="polite">{formatNumber(metrics.comparisons)}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Swaps</div>
          <div className="font-mono text-lg" aria-live="polite">{formatNumber(metrics.swaps)}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Accesses</div>
          <div className="font-mono text-lg" aria-live="polite">{formatNumber(metrics.accesses)}</div>
        </div>
      </div>
    </section>
  );
});