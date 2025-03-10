// components/AlgorithmSelector.jsx
import React, { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Memoize the component to prevent unnecessary re-renders
const AlgorithmSelector = ({ category, algorithm, onAlgorithmChange }) => {
  // Define algorithms as a constant outside of render to prevent recreation
  const algorithms = {
    sorting: {
      bubble: "Bubble Sort",
      selection: "Selection Sort",
      insertion: "Insertion Sort",
      merge: "Merge Sort",
      quick: "Quick Sort"
    },
    searching: {
      linear: "Linear Search",
      binary: "Binary Search"
    },
    graph: {
      bfs: "Breadth-First Search",
      dfs: "Depth-First Search"
    },
    dp: {
      fibonacci: "Fibonacci Sequence"
    },
    math: {
      gcd: "Greatest Common Divisor"
    }
  };

  // Get algorithms based on category
  const getAlgorithms = () => {
    return algorithms[category] || algorithms.sorting;
  };

  return (
    <Select 
      value={algorithm}
      onValueChange={onAlgorithmChange}
      aria-label="Select algorithm"
    >
      <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <SelectValue placeholder="Select algorithm" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(getAlgorithms()).map(
          ([value, label]) => (
            <SelectItem key={value} value={value} className="font-medium">
              {label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MemoizedAlgorithmSelector = memo(AlgorithmSelector);
export { AlgorithmSelector };