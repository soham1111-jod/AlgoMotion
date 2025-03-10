import { useState, useEffect } from 'react';

const ComparisonSelector = ({ category, selectedAlgorithms, onSelect }) => {
  const [selected, setSelected] = useState(selectedAlgorithms || []);
  
  // Update local state when props change
  useEffect(() => {
    if (selectedAlgorithms && Array.isArray(selectedAlgorithms)) {
      setSelected(selectedAlgorithms);
    }
  }, [selectedAlgorithms, category]);

  const sortingAlgorithms = [
    { id: 'bubble', name: 'Bubble Sort' },
    { id: 'selection', name: 'Selection Sort' },
    { id: 'insertion', name: 'Insertion Sort' },
    { id: 'quick', name: 'Quick Sort' },
    { id: 'merge', name: 'Merge Sort' }
  ];

  const searchingAlgorithms = [
    { id: 'linear', name: 'Linear Search' },
    { id: 'binary', name: 'Binary Search' }
  ];

  const graphAlgorithms = [
    { id: 'bfs', name: 'Breadth-First Search' },
    { id: 'dfs', name: 'Depth-First Search' }
  ];

  const dpAlgorithms = [
    { id: 'fibonacci', name: 'Fibonacci Sequence' }
  ];

  const mathAlgorithms = [
    { id: 'gcd', name: 'GCD (Euclidean)' }
  ];

  // Get algorithms based on category
  const getAlgorithms = () => {
    switch (category) {
      case 'sorting':
        return sortingAlgorithms;
      case 'searching':
        return searchingAlgorithms;
      case 'graph':
        return graphAlgorithms;
      case 'dp':
        return dpAlgorithms;
      case 'math':
        return mathAlgorithms;
      default:
        return sortingAlgorithms;
    }
  };

  const algorithms = getAlgorithms();

  // If no algorithms are selected, select the first one by default
  useEffect(() => {
    if ((!selected || selected.length === 0) && algorithms.length > 0) {
      const defaultSelected = [algorithms[0].id];
      setSelected(defaultSelected);
      onSelect(defaultSelected);
    }
  }, [algorithms, selected, onSelect]);

  const handleChange = (algorithmId) => {
    // Toggle selection
    let newSelected;
    if (selected.includes(algorithmId)) {
      // Don't allow deselecting the last algorithm
      if (selected.length <= 1) {
        return;
      }
      newSelected = selected.filter(id => id !== algorithmId);
    } else {
      newSelected = [...selected, algorithmId];
    }
    
    setSelected(newSelected);
    onSelect(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {algorithms.map(algo => (
        <button
          key={algo.id}
          onClick={() => handleChange(algo.id)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            selected.includes(algo.id)
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white hover:from-indigo-600 hover:to-purple-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {selected.includes(algo.id) ? '✓ ' : ''}{algo.name}
        </button>
      ))}
    </div>
  );
};

export { ComparisonSelector };