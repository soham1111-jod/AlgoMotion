import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import useAlgorithm from '../hooks/useAlgorithm';
import { MemoizedAlgorithmSelector } from '../../components/AlgorithmSelector';
import { bubbleSortSteps } from '../../algorithms/sorting/bubbleSort';
import { quickSortSteps } from '../../algorithms/sorting/quickSort';
import { mergeSortSteps } from '../../algorithms/sorting/mergeSort';
import { selectionSortSteps } from '../../algorithms/sorting/selectionSort';
import { insertionSortSteps } from '../../algorithms/sorting/insertionSort';
import { linearSearchSteps } from '../../algorithms/searching/linearSearch';
import { binarySearchSteps } from '../../algorithms/searching/binarySearch';
import { fibonacciSteps } from '../../algorithms/dp/fibonacci';
import { gcdSteps } from '../../algorithms/math/gcd';
import { generateRandomGraph } from '../../utils/graphUtils';
import { bfs } from '../../algorithms/graphs/BFS';
import { dfs } from '../../algorithms/graphs/DFS';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { AlgorithmExplanation } from '../../components/AlgorithmExplanation';
import { MemoizedSpeedControl } from '../../components/SpeedControl';
import { StatsPanel } from '../../components/StatsPanel';
import { VisualizationControlsModal } from '../../components/VisualizationControlsModal';

// Add CSS animations
const styles = `
  /* Graph Animations */
  .edge-traversal {
    stroke-dasharray: 10;
    animation: dash 1s linear infinite;
  }
  
  .edge-pulse {
    animation: pulse 1s ease-in-out infinite;
  }
  
  .edge-highlight {
    stroke-dasharray: 5;
    animation: dash-reverse 1s linear infinite;
  }
  
  .edge-glow {
    filter: drop-shadow(0 0 3px rgba(147, 51, 234, 0.5));
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw 1s ease-out forwards;
  }
  
  .node-pulse {
    animation: scale-pulse 1s ease-in-out infinite;
  }
  
  .node-glow {
    filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.6));
    animation: glow 1.5s ease-in-out infinite;
  }
  
  .node-visited {
    animation: pop 0.3s ease-out forwards;
  }
  
  .node-current {
    animation: bounce 0.5s ease-in-out infinite;
  }
  
  .node-path {
    animation: highlight 0.5s ease-out forwards;
  }
  
  .node-text-highlight {
    animation: text-pop 0.3s ease-out forwards;
  }
  
  /* Fibonacci Animations */
  .fib-current {
    animation: slide-in 0.3s ease-out forwards;
    animation-delay: calc(var(--calc-order) * 0.1s);
  }
  
  .fib-calculated {
    animation: pop-and-glow 0.5s ease-out forwards;
    animation-delay: calc(var(--calc-order) * 0.1s);
  }
  
  .fib-result {
    animation: celebrate 0.7s ease-out forwards;
  }
  
  .fib-used {
    animation: fade-and-scale 0.4s ease-out forwards;
  }
  
  /* GCD Animations */
  .gcd-current {
    animation: slide-up 0.3s ease-out forwards;
    animation-delay: calc(var(--step-order) * 0.15s);
  }
  
  .gcd-remainder {
    animation: fade-in-right 0.4s ease-out forwards;
    animation-delay: calc(var(--step-order) * 0.15s);
  }
  
  .gcd-result {
    animation: success-bounce 0.5s ease-out forwards;
  }
  
  .gcd-divided {
    animation: divide-effect 0.4s ease-out forwards;
  }
  
  /* Animation Keyframes */
  @keyframes dash {
    to {
      stroke-dashoffset: 20;
    }
  }
  
  @keyframes dash-reverse {
    to {
      stroke-dashoffset: -10;
    }
  }
  
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      stroke-width: 3;
      opacity: 1;
    }
    50% {
      stroke-width: 6;
      opacity: 0.6;
    }
  }
  
  @keyframes scale-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  @keyframes glow {
    0%, 100% {
      filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.6));
    }
    50% {
      filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.8));
    }
  }
  
  @keyframes pop {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes highlight {
    0% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.3);
    }
    100% {
      filter: brightness(1.1);
    }
  }
  
  @keyframes text-pop {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes slide-in {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes pop-and-glow {
    0% {
      transform: scale(0.9);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.2);
    }
    100% {
      transform: scale(1);
      filter: brightness(1.1);
    }
  }
  
  @keyframes celebrate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2) rotate(10deg);
    }
    100% {
      transform: scale(1) rotate(0);
    }
  }
  
  @keyframes fade-and-scale {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.95);
    }
    100% {
      opacity: 0.5;
      transform: scale(0.9);
    }
  }
  
  @keyframes slide-up {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fade-in-right {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes success-bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    75% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes divide-effect {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.8);
      opacity: 0.7;
    }
    100% {
      transform: scale(0.7);
      opacity: 0.5;
    }
  }
`;

// Add style tag to document
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

// Add CSS animations for sorting and searching
const sortingSearchingStyles = `
  /* Sorting Animations */
  @keyframes compare {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @keyframes swap {
    0% {
      transform: translateY(0) scale(1);
    }
    25% {
      transform: translateY(-15px) scale(1.1);
    }
    75% {
      transform: translateY(5px) scale(0.95);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes pivot {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.15);
      filter: brightness(1.3);
    }
    100% {
      transform: scale(1);
      filter: brightness(1.1);
    }
  }
  
  @keyframes sorted {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  /* Searching Animations */
  @keyframes search-compare {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1) translateY(-10px);
      filter: brightness(1.2);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
  
  @keyframes search-found {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    20% {
      transform: scale(1.2) translateY(-15px);
      filter: brightness(1.3);
    }
    40% {
      transform: scale(0.9) translateY(-5px);
      filter: brightness(1.2);
    }
    60% {
      transform: scale(1.1) translateY(-10px);
      filter: brightness(1.3);
    }
    80% {
      transform: scale(0.95) translateY(-5px);
      filter: brightness(1.2);
    }
    100% {
      transform: scale(1);
      filter: brightness(1.2);
    }
  }
  
  @keyframes search-eliminated {
    0% {
      transform: scale(1);
      opacity: 1;
      filter: grayscale(0);
    }
    100% {
      transform: scale(0.95);
      opacity: 0.5;
      filter: grayscale(0.8);
    }
  }
  
  /* Animation Classes */
  .compared-animation {
    animation: compare 0.5s ease-in-out;
  }
  
  .swapped-animation {
    animation: swap 0.7s ease-in-out;
  }
  
  .pivot-animation {
    animation: pivot 0.6s ease-in-out;
  }
  
  .sorted-animation {
    animation: sorted 0.4s ease-in-out;
  }
  
  .search-compared-animation {
    animation: search-compare 0.5s ease-in-out;
  }
  
  .search-found-animation {
    animation: search-found 1s ease-in-out;
    animation-fill-mode: forwards;
  }
  
  .search-eliminated-animation {
    animation: search-eliminated 0.4s ease-in-out forwards;
  }
`;

// Add styles to document without using hooks outside component
if (typeof document !== 'undefined') {
  const styleId = 'sorting-searching-animations';
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    styleTag.textContent = sortingSearchingStyles;
    document.head.appendChild(styleTag);
  }
}

// No need to memoize again since we're importing already memoized components
export default function Visualizer() {
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [category, setCategory] = useState('sorting');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [array, setArray] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [graph, setGraph] = useState(null);
  const [searchTarget, setSearchTarget] = useState(50);
  const [fibN, setFibN] = useState(10);
  const [gcdA, setGcdA] = useState(48);
  const [gcdB, setGcdB] = useState(18);
  const [colorTheme, setColorTheme] = useState('default');
  const [animationStyle, setAnimationStyle] = useState('default');
  const [elementSize, setElementSize] = useState(4); // Added back the elementSize state
  const [showHistory, setShowHistory] = useState(false); // Added back the showHistory state
  const [customArray, setCustomArray] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);
  const dropAreaRef = useRef(null);
  const [shouldPlay, setShouldPlay] = useState(false); // NEW: flag to trigger play after state updates
  const prevCategoryRef = useRef(category);
  const prevAlgorithmRef = useRef(algorithm);
  
  // Clean up styles when component unmounts
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        const styleTag = document.getElementById('sorting-searching-animations');
        if (styleTag) {
          document.head.removeChild(styleTag);
        }
      }
    };
  }, []);

  // Get algorithm hook
  const {
    isPlaying,
    speed,
    currentStep,
    steps,
    generateSteps,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setSpeed,
    setCurrentStep,  // Make sure setCurrentStep is destructured from the hook
    timerRef  // Make sure timerRef is destructured from the hook
  } = useAlgorithm();

  // Memoize algorithm configuration
  const algorithmConfig = useMemo(() => {
    // Create a stable reference to the algorithms
    const sortingAlgorithms = {
      bubble: bubbleSortSteps,
      quick: quickSortSteps,
      merge: mergeSortSteps,
      selection: selectionSortSteps,
      insertion: insertionSortSteps
    };
    
    const searchingAlgorithms = {
      linear: (arr) => linearSearchSteps(arr, searchTarget),
      binary: (arr) => binarySearchSteps(arr, searchTarget)
    };
    
    const graphAlgorithms = { 
      bfs: bfs,
      dfs: dfs
    };
    
    const dpAlgorithms = {
      fibonacci: () => fibonacciSteps(fibN)
    };
    
    const mathAlgorithms = {
      gcd: () => gcdSteps(gcdA, gcdB)
    };
    
    return {
      sorting: {
        input: array,
        algorithms: sortingAlgorithms
      },
      searching: {
        input: array,
        algorithms: searchingAlgorithms
      },
      graph: {
        input: graph,
        algorithms: graphAlgorithms
      },
      dp: {
        input: null,
        algorithms: dpAlgorithms
      },
      math: {
        input: null,
        algorithms: mathAlgorithms
      }
    };
  }, [array, graph, searchTarget, fibN, gcdA, gcdB]);

  // Use useCallback for event handlers
  const generateNewArray = useCallback(() => {
    console.log('Generating new array');
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);
    console.log('New array generated:', newArray);
    setArray(newArray);
    setStepHistory([]);
    
    if (setCurrentStep) {
      setCurrentStep(0);
    } else {
      console.error('setCurrentStep is not a function');
    }
    
    // Initialize visualization with the new array
    if (category === 'sorting' || category === 'searching') {
      console.log('Initializing visualization with new array');
      const algorithmFn = algorithmConfig[category]?.algorithms[algorithm];
      if (algorithmFn) {
        try {
          console.log('Generating steps for new array with algorithm:', algorithm);
          const success = generateSteps(algorithmFn, newArray);
          console.log('Steps generation result:', { success, stepsCount: steps.length });
        } catch (error) {
          console.error('Error generating steps for new array:', error);
        }
      }
    }
  }, [category, algorithm, algorithmConfig, generateSteps, steps.length, setCurrentStep]);

  const generateNewGraph = useCallback(() => {
    console.log('Generating new graph');
    const newGraph = generateRandomGraph(8, 0.4);
    console.log('New graph generated:', newGraph);
    setGraph(newGraph);
    setStepHistory([]);
    
    if (setCurrentStep) {
      setCurrentStep(0);
    } else {
      console.error('setCurrentStep is not a function in generateNewGraph');
    }
    
    // Initialize visualization with the new graph
    if (category === 'graph') {
      console.log('Initializing visualization with new graph');
      const algorithmFn = algorithmConfig[category]?.algorithms[algorithm];
      if (algorithmFn) {
        try {
          console.log('Generating steps for new graph with algorithm:', algorithm);
          const success = generateSteps(algorithmFn, newGraph);
          console.log('Steps generation result:', { success, stepsCount: steps.length });
        } catch (error) {
          console.error('Error generating steps for new graph:', error);
        }
      }
    }
  }, [category, algorithm, algorithmConfig, generateSteps, steps.length, setCurrentStep]);
  
  const handleCustomArray = useCallback(() => {
    const numbers = customInput.split(',').map(num => {
      const parsed = parseInt(num.trim(), 10);
      return isNaN(parsed) ? null : parsed;
    }).filter(num => num !== null);

    if (numbers.length > 0) {
      setArray(numbers);
      
      // Initialize visualization with the custom array
      if (category === 'sorting' || category === 'searching') {
        const algorithmFn = algorithmConfig[category]?.algorithms[algorithm];
        if (algorithmFn) {
          setCurrentStep(0);
          setStepHistory([]);
          generateSteps(algorithmFn, numbers);
        }
      }
    } else {
      alert('Please enter valid numbers separated by commas (e.g., "5, 3, 7, 1")');
    }
  }, [customInput, category, algorithm, algorithmConfig, generateSteps, setCurrentStep]);

  // Use useCallback for drag and drop handlers
  const handleDragStart = useCallback((e, value) => {
    setDraggedItem(value);
    e.dataTransfer.setData('text/plain', value);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('drag-over');
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('drag-over');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const value = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(value)) {
      setCustomArray(prev => [...prev, value]);
    }
    setDraggedItem(null);
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('drag-over');
    }
  }, []);
  
  const useCustomArrayForVisualization = useCallback(() => {
    if (customArray.length > 0) {
      setArray(customArray);
      
      // Initialize visualization with the custom array
      if (category === 'sorting' || category === 'searching') {
        const algorithmFn = algorithmConfig[category]?.algorithms[algorithm];
        if (algorithmFn) {
          setCurrentStep(0);
          setStepHistory([]);
          generateSteps(algorithmFn, customArray);
        }
      }
    } else {
      alert('Please drag at least one number to the drop area');
    }
  }, [customArray, category, algorithm, algorithmConfig, generateSteps, setCurrentStep]);
  
  const clearCustomArray = useCallback(() => {
    setCustomArray([]);
  }, []);

  // Generate initial random array
  useEffect(() => {
    console.log('Initial setup effect running');
    if (array.length === 0) {
      console.log('No array found, generating initial array');
      generateNewArray();
    }
    if (category === 'graph' && (!graph || !graph.nodes || !graph.edges)) {
      console.log('No graph found or category changed to graph, generating new graph');
      generateNewGraph();
    }
  }, [category, generateNewArray, array.length, generateNewGraph, graph]);

  // Only reset/generate steps if category or algorithm actually changed
  useEffect(() => {
    const prevCategory = prevCategoryRef.current;
    const prevAlgorithm = prevAlgorithmRef.current;
    if (category !== prevCategory || algorithm !== prevAlgorithm) {
      console.log('Algorithm/category change effect running:', { category, algorithm });
      // Stop any running animation when algorithm or category changes
      if (isPlaying) {
        console.log('Stopping animation due to algorithm or category change');
        pause();
      }
      // Skip if we don't have a valid algorithm
      if (!algorithmConfig[category]?.algorithms[algorithm]) {
        console.log('No valid algorithm found:', { category, algorithm });
        prevCategoryRef.current = category;
        prevAlgorithmRef.current = algorithm;
        return;
      }
      // Reset step state
      setCurrentStep(0);
      setStepHistory([]);
      // For sorting and searching, ensure we have a valid array
      if ((category === 'sorting' || category === 'searching') && array.length > 0) {
        console.log('Generating steps for sorting/searching with existing array');
        try {
          const algorithmFn = algorithmConfig[category].algorithms[algorithm];
          const success = generateSteps(algorithmFn, array);
          console.log('Steps generation result:', { success, stepsCount: steps.length });
        } catch (error) {
          console.error('Error generating steps for algorithm change:', error);
        }
      }
      // For graph algorithms, ensure we have a valid graph
      if (category === 'graph' && graph && graph.nodes && graph.edges) {
        console.log('Generating steps for graph with existing graph');
        try {
          const algorithmFn = algorithmConfig[category].algorithms[algorithm];
          const success = generateSteps(algorithmFn, graph);
          console.log('Steps generation result:', { success, stepsCount: steps.length });
        } catch (error) {
          console.error('Error generating steps for algorithm change:', error);
        }
      }
      // For other categories (dp, math), generate steps if we have a valid algorithm
      if ((category === 'dp' || category === 'math') && algorithmConfig[category]?.algorithms[algorithm]) {
        console.log('Generating steps for', category);
        try {
          const algorithmFn = algorithmConfig[category].algorithms[algorithm];
          const success = generateSteps(algorithmFn, null);
          console.log('Steps generation result:', { success, stepsCount: steps.length });
        } catch (error) {
          console.error('Error generating steps for algorithm change:', error);
        }
      }
    }
    prevCategoryRef.current = category;
    prevAlgorithmRef.current = algorithm;
  }, [category, algorithm, array, graph, algorithmConfig, generateSteps, setCurrentStep, steps.length, isPlaying, pause]);

  // Get color based on theme
  const getThemeColors = () => {
    switch (colorTheme) {
      case 'blue':
        return {
          default: 'bg-blue-500 dark:bg-blue-600',
          compared: 'bg-yellow-500 dark:bg-yellow-600 shadow-md',
          swapped: 'bg-red-500 dark:bg-red-600 shadow-lg',
          pivot: 'bg-purple-500 dark:bg-purple-600 shadow-md',
          sorted: 'bg-green-500 dark:bg-green-600 shadow-sm',
          found: 'bg-green-600 dark:bg-green-700 shadow-lg',
          eliminated: 'bg-gray-500 dark:bg-gray-600',
          checked: 'bg-orange-400 dark:bg-orange-500',
          range: 'bg-blue-400 dark:bg-blue-500'
        };
      case 'green':
        return {
          default: 'bg-green-500 dark:bg-green-600',
          compared: 'bg-yellow-500 dark:bg-yellow-600 shadow-md',
          swapped: 'bg-red-500 dark:bg-red-600 shadow-lg',
          pivot: 'bg-purple-500 dark:bg-purple-600 shadow-md',
          sorted: 'bg-blue-500 dark:bg-blue-600 shadow-sm',
          found: 'bg-blue-600 dark:bg-blue-700 shadow-lg',
          eliminated: 'bg-gray-500 dark:bg-gray-600',
          checked: 'bg-orange-400 dark:bg-orange-500',
          range: 'bg-green-400 dark:bg-green-500'
        };
      case 'purple':
        return {
          default: 'bg-purple-500 dark:bg-purple-600',
          compared: 'bg-yellow-500 dark:bg-yellow-600 shadow-md',
          swapped: 'bg-red-500 dark:bg-red-600 shadow-lg',
          pivot: 'bg-blue-500 dark:bg-blue-600 shadow-md',
          sorted: 'bg-green-500 dark:bg-green-600 shadow-sm',
          found: 'bg-green-600 dark:bg-green-700 shadow-lg',
          eliminated: 'bg-gray-500 dark:bg-gray-600',
          checked: 'bg-orange-400 dark:bg-orange-500',
          range: 'bg-purple-400 dark:bg-purple-500'
        };
      case 'orange':
        return {
          default: 'bg-orange-500 dark:bg-orange-600',
          compared: 'bg-blue-500 dark:bg-blue-600 shadow-md',
          swapped: 'bg-red-500 dark:bg-red-600 shadow-lg',
          pivot: 'bg-purple-500 dark:bg-purple-600 shadow-md',
          sorted: 'bg-green-500 dark:bg-green-600 shadow-sm',
          found: 'bg-green-600 dark:bg-green-700 shadow-lg',
          eliminated: 'bg-gray-500 dark:bg-gray-600',
          checked: 'bg-yellow-400 dark:bg-yellow-500',
          range: 'bg-orange-400 dark:bg-orange-500'
        };
      case 'red':
        return {
          default: 'bg-red-500 dark:bg-red-600',
          compared: 'bg-yellow-500 dark:bg-yellow-600 shadow-md',
          swapped: 'bg-blue-500 dark:bg-blue-600 shadow-lg',
          pivot: 'bg-purple-500 dark:bg-purple-600 shadow-md',
          sorted: 'bg-green-500 dark:bg-green-600 shadow-sm',
          found: 'bg-green-600 dark:bg-green-700 shadow-lg',
          eliminated: 'bg-gray-500 dark:bg-gray-600',
          checked: 'bg-orange-400 dark:bg-orange-500',
          range: 'bg-red-400 dark:bg-red-500'
        };
      case 'race':
        return {
          default: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          compared: 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md',
          swapped: 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg',
          pivot: 'bg-gradient-to-r from-purple-500 to-violet-600 shadow-md',
          sorted: 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm',
          found: 'bg-gradient-to-r from-green-600 to-teal-700 shadow-lg',
          eliminated: 'bg-gradient-to-r from-gray-500 to-gray-600',
          checked: 'bg-gradient-to-r from-orange-400 to-amber-500',
          range: 'bg-gradient-to-r from-gray-400 to-gray-500'
        };
      default:
        return {
          default: 'bg-blue-500 dark:bg-blue-600',
          compared: 'bg-yellow-500 dark:bg-yellow-600 shadow-md',
          swapped: 'bg-red-500 dark:bg-red-600 shadow-lg',
          pivot: 'bg-purple-500 dark:bg-purple-600 shadow-md',
          sorted: 'bg-green-500 dark:bg-green-600 shadow-sm',
          found: 'bg-green-600 dark:bg-green-700 shadow-lg',
          eliminated: 'bg-gray-500 dark:bg-gray-600',
          checked: 'bg-orange-400 dark:bg-orange-500',
          range: 'bg-blue-400 dark:bg-blue-500'
        };
    }
  };

  // Memoize theme colors
  const colors = useMemo(() => getThemeColors(), [colorTheme]);

  // Use useCallback for animation class getter
  const getAnimationClass = useCallback((state) => {
    if (!state || animationStyle === 'default') return '';
    
    switch (animationStyle) {
      case 'smooth': 
        return 'transition-all duration-300 ease-in-out transform';
      case 'bounce': 
        return 'animate-bounce';
      case 'elastic': 
        return 'transition-all duration-500 ease-elastic transform';
      case 'race': 
        return 'transition-all duration-150 ease-in-out transform';
      default: 
        return '';
    }
  }, [animationStyle]);

  const getAnimationStyle = useCallback((item) => {
    if (!item || !item.state) return {};
    
    const baseStyle = {
      transition: `all ${animationStyle === 'race' ? '0.15s' : '0.3s'} ${animationStyle === 'elastic' ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-in-out'}`
    };
    
    switch (item.state) {
      case 'swapped':
        baseStyle.transform = animationStyle === 'race' 
          ? 'translateY(-20px) scale(1.05)' 
          : 'translateY(-15px) scale(1.1)';
        baseStyle.zIndex = 10;
        baseStyle.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        break;
      case 'compared':
        baseStyle.transform = animationStyle === 'race' 
          ? 'translateY(-15px) scale(1.03)' 
          : 'translateY(-10px) scale(1.05)';
        baseStyle.zIndex = 5;
        baseStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        break;
      case 'pivot':
        baseStyle.transform = animationStyle === 'race' 
          ? 'scale(1.1) translateY(-5px)' 
          : 'scale(1.05) translateY(-5px)';
        baseStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        baseStyle.zIndex = 5;
        break;
      case 'found':
        baseStyle.transform = 'scale(1.15) translateY(-10px)';
        baseStyle.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
        baseStyle.zIndex = 10;
        break;
      case 'sorted':
        baseStyle.transition = 'all 0.5s ease-out';
        baseStyle.transform = 'translateY(-3px)';
        baseStyle.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)';
        break;
      default:
        break;
    }
    
    return baseStyle;
  }, [animationStyle]);

  // Add a step explanation component
  const StepExplanation = ({ step, algorithm, category }) => {
    if (!step || !step.meta) return null;
    
    const getAlgorithmName = () => {
      switch (algorithm) {
        case 'bubble': return 'Bubble Sort';
        case 'quick': return 'Quick Sort';
        case 'merge': return 'Merge Sort';
        case 'insertion': return 'Insertion Sort';
        case 'selection': return 'Selection Sort';
        case 'heap': return 'Heap Sort';
        case 'linear': return 'Linear Search';
        case 'binary': return 'Binary Search';
        case 'bfs': return 'Breadth-First Search';
        case 'dfs': return 'Depth-First Search';
        case 'dijkstra': return 'Dijkstra\'s Algorithm';
        case 'fibonacci': return 'Fibonacci';
        case 'gcd': return 'Greatest Common Divisor';
        default: return algorithm;
      }
    };
    
    // Get animation description based on algorithm and step type
    const getAnimationDescription = () => {
      if (!step.meta.type) return '';
      
      const descriptions = {
        sorting: {
          compare: 'Comparing elements',
          swap: 'Swapping elements',
          pivot: 'Selecting pivot element',
          partition: 'Partitioning array around pivot',
          merge: 'Merging subarrays',
          shift: 'Shifting elements',
          heapify: 'Heapifying the array',
          sorted: 'Elements in sorted position'
        },
        searching: {
          compare: 'Comparing with target',
          eliminate: 'Eliminating section',
          found: 'Target found',
          notFound: 'Target not found',
          updateBounds: 'Updating search bounds'
        },
        graph: {
          visit: 'Visiting node',
          explore: 'Exploring neighbors',
          enqueue: 'Adding to queue',
          dequeue: 'Removing from queue',
          push: 'Adding to stack',
          pop: 'Removing from stack',
          relax: 'Updating shortest path',
          backtrack: 'Backtracking path',
          complete: 'Traversal complete'
        }
      };
      
      return descriptions[category]?.[step.meta.type] || step.meta.type;
    };
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{getAlgorithmName()} - Step {currentStep + 1}/{steps.length}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {category === 'sorting' && 'Sorting Algorithm'}
            {category === 'searching' && 'Searching Algorithm'}
            {category === 'graph' && 'Graph Traversal'}
            {category === 'dp' && 'Dynamic Programming'}
            {category === 'math' && 'Mathematical Algorithm'}
          </div>
        </div>
        
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2">
            {getAnimationDescription()}
          </span>
          {step.meta.complexity && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              Complexity: {step.meta.complexity}
            </span>
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300">{step.explanation}</p>
        
        {step.meta.code && (
          <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap">{step.meta.code}</pre>
          </div>
        )}
      </div>
    );
  };

  // Create a separate function for the visualization content
  const renderContent = useCallback(() => {
    console.log('Rendering content:', { 
      category, 
      algorithm, 
      stepsLength: steps.length, 
      currentStep,
      hasArray: array && array.length > 0,
      hasGraph: graph && graph.nodes && graph.edges
    });
    
    // If no steps, show initial state
    if (!steps || steps.length === 0) {
      if (array && array.length > 0 && (category === 'sorting' || category === 'searching')) {
        console.log('Rendering initial array:', array);
        return (
          <div className="flex items-end justify-center h-[300px] gap-1">
            {array.map((value, index) => {
              const height = `${(value / 100) * 280}px`;
              const width = `${Math.max(8, Math.min(30, 600 / array.length - 2))}px`;
              
              return (
                <div
                  key={index}
                  className={`${colors.default} rounded-t-md bar-transition`}
                  style={{
                    height,
                    width,
                    minWidth: width
                  }}
                  title={`Value: ${value}`}
                >
                  {array.length <= 20 && (
                    <div className="text-center text-xs font-mono mt-1 text-white">{value}</div>
                  )}
                </div>
              );
            })}
          </div>
        );
      } else if (category === 'graph') {
        // Show initial graph state or loading state
        return (
          <div className="flex items-center justify-center h-[300px]">
            {graph && graph.nodes && graph.edges ? (
            <svg width="600" height="300" className="border border-gray-200 dark:border-gray-700 rounded-md">
              {graph.nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    className={`${colors.default} cursor-pointer transition-all duration-300`}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-sm font-bold"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
              {graph.edges.map((edge, index) => {
                const source = graph.nodes.find(n => n.id === edge.source);
                const target = graph.nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;
                
                return (
                  <line
                    key={index}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className="stroke-gray-400 dark:stroke-gray-600 transition-all duration-300"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                Initializing graph visualization...
          </div>
            )}
          </div>
        );
      }
      
      // If no initial state to show, display a message
      return (
        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
          {category === 'sorting' || category === 'searching' 
            ? 'Click "Generate New Array" to create an array for visualization'
            : category === 'graph'
            ? 'Click "Generate New Graph" to create a graph for visualization'
            : 'Select an algorithm and click Play to start visualization'}
        </div>
      );
    }

    // Get current step data
    const currentStepData = steps[currentStep];
    console.log('Current step data:', { 
      currentStep, 
      data: currentStepData,
      hasArray: currentStepData?.array,
      hasMeta: currentStepData?.meta
    });
    
    if (!currentStepData) {
      return (
        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
          No data available for visualization
        </div>
      );
    }
    
    switch (category) {
      case 'sorting':
        // Handle sorting visualization - check for array property in the step data
        if (currentStepData.array && Array.isArray(currentStepData.array)) {
          return (
            <div className="flex flex-col items-center">
          <div className="flex items-end justify-center h-[300px] gap-1">
                {currentStepData.array.map((item, index) => {
              if (!item || typeof item !== 'object') return null;
              
              const height = `${(item.value / 100) * 280}px`;
                  const width = `${Math.max(8, Math.min(30, 600 / currentStepData.array.length - 2))}px`;
              
              let bgColorClass = colors.default;
              if (item.state === 'compared') bgColorClass = colors.compared;
              if (item.state === 'swapped') bgColorClass = colors.swapped;
              if (item.state === 'pivot') bgColorClass = colors.pivot;
              if (item.state === 'sorted') bgColorClass = colors.sorted;
              
              return (
                <div
                      key={index}
                      className={`${bgColorClass} rounded-t-md will-change-transform`}
                  style={{
                    height,
                    width,
                        minWidth: width
                  }}
                  title={`Value: ${item.value}`}
                >
                      {currentStepData.array.length <= 20 && (
                    <div className="text-center text-xs font-mono mt-1 text-white">{item.value}</div>
                  )}
                </div>
              );
            })}
              </div>
              
              {currentStepData.meta && currentStepData.meta.description && (
                <div className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
                  {currentStepData.meta.description}
                </div>
              )}
              
              <div className="mt-4 flex gap-2 justify-center">
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 ${colors.default} rounded`}></div>
                  <span className="text-xs">Default</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 ${colors.compared} rounded`}></div>
                  <span className="text-xs">Comparing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 ${colors.swapped} rounded`}></div>
                  <span className="text-xs">Swapping</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 ${colors.pivot} rounded`}></div>
                  <span className="text-xs">Pivot</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 ${colors.sorted} rounded`}></div>
                  <span className="text-xs">Sorted</span>
                </div>
              </div>
            </div>
          );
        }
        
        // Fallback if data format is unexpected
        return (
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            Invalid data format for sorting visualization
          </div>
        );
        
      case 'searching':
        // Handle searching visualization - check for array property in the step data
        if (currentStepData.array && Array.isArray(currentStepData.array)) {
          return (
            <div className="flex flex-col items-center">
              <div className="flex items-end justify-center h-[300px] gap-1">
                {currentStepData.array.map((item, index) => {
                  if (!item || typeof item !== 'object') return null;
                  
                  const height = `${(item.value / 100) * 280}px`;
                  const width = `${Math.max(8, Math.min(30, 600 / currentStepData.array.length - 2))}px`;
                  
                  let bgColorClass = colors.default;
                  if (item.state === 'compared') bgColorClass = colors.compared;
                  if (item.state === 'found') bgColorClass = colors.found;
                  if (item.state === 'eliminated') bgColorClass = colors.eliminated;
                  
                  // Add animation class based on state
                  let animationClass = '';
                  if (item.state === 'compared') {
                    animationClass = 'search-compared-animation';
                  } else if (item.state === 'found') {
                    animationClass = 'search-found-animation';
                  } else if (item.state === 'eliminated') {
                    animationClass = 'search-eliminated-animation';
                  }
                  
                  return (
                    <div
                      key={`${index}-${item.value}`}
                      className={`${bgColorClass} rounded-t-md will-change-transform ${animationClass}`}
                      style={{
                        height,
                        width,
                        minWidth: width,
                        zIndex: item.state === 'found' ? 10 : item.state === 'compared' ? 5 : 1
                      }}
                      title={`Value: ${item.value}`}
                    >
                      {currentStepData.array.length <= 20 && (
                        <div className="text-center text-xs font-mono mt-1 text-white">{item.value}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {currentStepData.meta && currentStepData.meta.description && (
                <div className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
                  {currentStepData.meta.description}
                </div>
              )}
              
              <div className="text-center mt-4">
                <div className="text-sm mb-2">Searching for: <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{searchTarget}</span></div>
                <div className="flex gap-2 justify-center">
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 ${colors.compared} rounded`}></div>
                    <span className="text-xs">Comparing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 ${colors.found} rounded`}></div>
                    <span className="text-xs">Found</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 ${colors.eliminated} rounded`}></div>
                    <span className="text-xs">Eliminated</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        // Fallback if data format is unexpected
        return (
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            Invalid data format for searching visualization
          </div>
        );
        
      case 'graph':
        // Handle graph visualization - check for nodes and edges properties in the step data
        if (currentStepData.data && currentStepData.data.nodes && Array.isArray(currentStepData.data.nodes) && 
            currentStepData.data.edges && Array.isArray(currentStepData.data.edges)) {
          
          // Use the data property which contains the graph state
          const graphData = currentStepData.data;
          
          // Determine the algorithm-specific class for the container
          let algorithmClass = '';
          if (algorithm === 'dfs') {
            algorithmClass = 'dfs-traversal';
          } else if (algorithm === 'bfs') {
            algorithmClass = 'bfs-traversal';
          }
          
          return (
            <div className={`flex flex-col items-center justify-center h-[300px] ${algorithmClass}`}>
              <svg width="600" height="300" className="border border-gray-200 dark:border-gray-700 rounded-md">
                {/* Draw edges first so they appear behind nodes */}
                {graphData.edges.map((edge, index) => {
                  const source = graphData.nodes.find(n => n.id === edge.source);
                  const target = graphData.nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;
                  
                  let edgeClass = "stroke-gray-400 dark:stroke-gray-600";
                  let animationClass = "";
                  
                  // Enhanced edge animations based on state
                  if (edge.state === 'visited') {
                    edgeClass = "stroke-green-500 dark:stroke-green-400";
                    animationClass = "edge-traversal";
                  } else if (edge.state === 'current') {
                    edgeClass = "stroke-yellow-500 dark:stroke-yellow-400";
                    animationClass = "edge-pulse";
                  } else if (edge.state === 'path') {
                    edgeClass = "stroke-blue-500 dark:stroke-blue-400";
                    animationClass = "edge-highlight";
                  } else if (edge.state === 'shortest') {
                    edgeClass = "stroke-purple-500 dark:stroke-purple-400";
                    animationClass = "edge-glow";
                  }
                  
                  return (
                    <line
                      key={index}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      className={`${edgeClass} ${animationClass} transition-all duration-300`}
                      strokeWidth={edge.state === 'shortest' ? "4" : "3"}
                    />
                  );
                })}
                
                {/* Draw nodes on top of edges */}
                {graphData.nodes.map((node, index) => {
                  let nodeClass = colors.default;
                  let animationClass = "";
                  
                  // Enhanced node animations based on state
                  if (node.state === 'start') {
                    nodeClass = colors.compared;
                    animationClass = "node-pulse";
                  } else if (node.state === 'end') {
                    nodeClass = colors.found;
                    animationClass = "node-glow";
                  } else if (node.state === 'visited') {
                    nodeClass = colors.sorted;
                    animationClass = "node-visited";
                  } else if (node.state === 'current') {
                    nodeClass = colors.swapped;
                    animationClass = "node-current";
                  } else if (node.state === 'path') {
                    nodeClass = colors.pivot;
                    animationClass = "node-path";
                  }
                  
                  return (
                    <g key={index}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        className={`${nodeClass} ${animationClass} transition-all duration-300`}
                        strokeWidth="2"
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`fill-white text-sm font-bold ${node.state === 'current' ? 'node-text-highlight' : ''}`}
                      >
                        {node.label || node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {currentStepData.meta && currentStepData.meta.description && (
                <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                  {currentStepData.meta.description}
                </div>
              )}
            </div>
          );
        }
        
        // If we have a graph but no visualization data, show the initial graph
        if (graph && graph.nodes && Array.isArray(graph.nodes) && graph.edges && Array.isArray(graph.edges)) {
          return (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <svg width="600" height="300" className="border border-gray-200 dark:border-gray-700 rounded-md">
                {/* Draw edges first so they appear behind nodes */}
                {graph.edges.map((edge, index) => {
                  const source = graph.nodes.find(n => n.id === edge.source);
                  const target = graph.nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;
                  
                  return (
                    <line
                      key={index}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      className="stroke-gray-400 dark:stroke-gray-600 transition-all duration-300"
                      strokeWidth="3"
                    />
                  );
                })}
                
                {/* Draw nodes on top of edges */}
                {graph.nodes.map((node, index) => (
                  <g key={index}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      className={`${colors.default} transition-all duration-300`}
                      strokeWidth="2"
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-sm font-bold"
                    >
                      {node.label || node.id}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="mt-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Click "Play" to start the {algorithm === 'bfs' ? 'Breadth-First Search' : 'Depth-First Search'} visualization
                </p>
              </div>
            </div>
          );
        }
        
        // Fallback if no graph data
        return (
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            No graph data available. Click "Generate New Graph" to create a graph.
          </div>
        );
        
      case 'dp':
        if (!currentStepData || !Array.isArray(currentStepData)) {
          return (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No data available for visualization
            </div>
          );
        }
        
        return (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="text-center mb-4">
              <div className="text-lg font-semibold mb-2">Fibonacci Sequence</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Calculate the {fibN}th Fibonacci number
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 max-w-[600px]">
              {currentStepData.map((item, index) => {
                if (!item || typeof item !== 'object') return null;
                
                let bgColorClass = colors.default;
                let animationClass = '';
                
                // Enhanced animations for Fibonacci states
                if (item.state === 'current') {
                  bgColorClass = colors.compared;
                  animationClass = 'fib-current';
                } else if (item.state === 'calculated') {
                  bgColorClass = colors.sorted;
                  animationClass = 'fib-calculated';
                } else if (item.state === 'result') {
                  bgColorClass = colors.found;
                  animationClass = 'fib-result';
                } else if (item.state === 'used') {
                  bgColorClass = colors.pivot;
                  animationClass = 'fib-used';
                }
                
                // Add calculation order for sequential animations
                const calcOrderStyle = item.calcOrder ? { '--calc-order': item.calcOrder } : {};
                
                return (
                  <div
                    key={index}
                    className={`${bgColorClass} rounded-md will-change-transform ${animationClass} flex flex-col items-center justify-center p-2 w-16 h-16 transition-all`}
                    style={calcOrderStyle}
                  >
                    <div className="text-white font-mono text-lg">{item.value}</div>
                    <div className="text-white text-xs">F({item.index})</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'math':
        if (!currentStepData || !Array.isArray(currentStepData)) {
          return (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No data available for visualization
            </div>
          );
        }
        
        return (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="text-center mb-4">
              <div className="text-lg font-semibold mb-2">Greatest Common Divisor</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Calculate GCD({gcdA}, {gcdB})
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-[600px]">
              {currentStepData.map((item, index) => {
                if (!item || typeof item !== 'object') return null;
                
                let bgColorClass = colors.default;
                let animationClass = '';
                
                // Enhanced animations for GCD states
                if (item.state === 'current') {
                  bgColorClass = colors.compared;
                  animationClass = 'gcd-current';
                } else if (item.state === 'remainder') {
                  bgColorClass = colors.checked;
                  animationClass = 'gcd-remainder';
                } else if (item.state === 'result') {
                  bgColorClass = colors.found;
                  animationClass = 'gcd-result';
                } else if (item.state === 'divided') {
                  bgColorClass = colors.pivot;
                  animationClass = 'gcd-divided';
                }
                
                // Add step order for sequential animations
                const stepOrderStyle = item.stepOrder ? { '--step-order': item.stepOrder } : {};
                
                return (
                  <div
                    key={index}
                    className={`${bgColorClass} rounded-md will-change-transform ${animationClass} flex items-center justify-center p-2 w-20 h-20 transition-all`}
                    style={stepOrderStyle}
                    title={item.description || ''}
                  >
                    <div className="text-white font-mono text-xl">{item.value}</div>
                    {item.operation && (
                      <div className="absolute -bottom-6 text-gray-600 dark:text-gray-400 text-sm">
                        {item.operation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            Select an algorithm and click Play to start visualization
          </div>
        );
    }
  }, [category, algorithm, steps, currentStep, colors, array, searchTarget, graph, fibN, gcdA, gcdB, animationStyle]);

  // Add a function to handle play button click
  const handlePlayButtonClick = useCallback(() => {
    console.log('Play button clicked:', { 
      isPlaying, 
      currentStep, 
      stepsLength: steps.length, 
      category, 
      algorithm
    });
    // If already playing, just pause
    if (isPlaying) {
      console.log('Pausing animation');
      pause();
      return;
    }
    // If at the end of steps, reset to beginning
    if (steps.length > 0 && currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setShouldPlay(true); // trigger play after reset
      return;
    }
    // If no steps, generate them and trigger play after
    if (steps.length === 0) {
      if ((category === 'sorting' || category === 'searching') && (!array || array.length === 0)) {
        generateNewArray();
        setShouldPlay(true); // trigger play after array/steps are ready
        return;
      }
      if (category === 'graph' && (!graph || !graph.nodes || !graph.edges)) {
        generateNewGraph();
        setShouldPlay(true); // trigger play after graph/steps are ready
        return;
      }
      if (algorithmConfig[category]?.algorithms[algorithm]) {
        let input = algorithmConfig[category].input;
        if (!input) return;
        generateSteps(
          algorithmConfig[category].algorithms[algorithm],
          input
        );
        setShouldPlay(true); // trigger play after steps are ready
        return;
      }
    }
    // If we have steps and we're not at the end, just play
    play();
  }, [isPlaying, currentStep, steps.length, category, algorithm, algorithmConfig, array, graph, generateNewArray, generateNewGraph, generateSteps, play, pause, setCurrentStep]);

  // NEW: Effect to trigger play after steps/currentStep update
  useEffect(() => {
    if (shouldPlay) {
      // Only play if steps are available and currentStep is at 0
      if (steps.length > 0 && currentStep === 0 && !isPlaying) {
        play();
        setShouldPlay(false);
      }
    }
  }, [shouldPlay, steps.length, currentStep, isPlaying, play]);

  // Update the play button text based on the current state
  const getPlayButtonText = () => {
    if (isPlaying) {
      return 'Pause';
    }
    
    if (steps.length > 0 && currentStep >= steps.length - 1) {
      return 'Restart';
    }
    
    return 'Play';
  };

  // Cleanup effect to stop animation when component unmounts
  useEffect(() => {
    return () => {
      // Ensure any running animation is stopped when component unmounts
      if (timerRef && timerRef.current) {
        console.log('Cleaning up animation timer on unmount');
        clearTimeout(timerRef.current);
      }
    };
  }, [timerRef]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Algorithm Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Visualize and understand how different algorithms work through interactive animations. Select an algorithm category and specific algorithm to get started.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              {/* Algorithm selection controls - improved for mobile */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sorting">Sorting</SelectItem>
                      <SelectItem value="searching">Searching</SelectItem>
                      <SelectItem value="graph">Graph Traversal</SelectItem>
                      <SelectItem value="dp">Dynamic Programming</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Algorithm
                  </label>
                  <MemoizedAlgorithmSelector 
                    category={category} 
                    algorithm={algorithm} 
                    onAlgorithmChange={setAlgorithm} 
                  />
                </div>
              </div>

              {/* Controls for array generation - improved for mobile */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {(category === 'sorting' || category === 'searching') && (
                  <>
                    <button
                      onClick={() => generateNewArray()}
                      className={`w-full sm:w-auto px-4 py-2 text-white rounded-md transition-all duration-200 shadow-sm font-medium ${
                        colorTheme === 'race' 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-lg transform hover:-translate-y-0.5' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Generate Random Array
                    </button>
                    
                    <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
                      <input
                        type="text"
                        placeholder="Custom array (comma separated)"
                        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                      />
                      <button
                        onClick={handleCustomArray}
                        className={`absolute right-1 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-sm ${
                          colorTheme === 'race'
                            ? 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        } text-gray-800 dark:text-gray-200 transition-all duration-200`}
                      >
                        Set
                      </button>
                    </div>
                  </>
                )}

                {category === 'graph' && (
                  <button
                    onClick={generateNewGraph}
                    className={`w-full sm:w-auto px-4 py-2 text-white rounded-md transition-all duration-200 shadow-sm font-medium ${
                      colorTheme === 'race'
                        ? 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Generate New Graph
                  </button>
                )}
              </div>

              {/* Drag and drop area - improved for mobile */}
              {(category === 'sorting' || category === 'searching') && (
                <div className="mb-4 p-3 sm:p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <div className="mb-2 text-sm font-medium">Drag and Drop Numbers</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.from({ length: 10 }, (_, i) => i * 10 + 10).map((value) => (
                      <div
                        key={value}
                        draggable
                        onDragStart={(e) => handleDragStart(e, value)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-md flex items-center justify-center cursor-move hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                  
                  <div
                    ref={dropAreaRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="min-h-[80px] p-2 sm:p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-2 items-center transition-all"
                  >
                    {customArray && customArray.length > 0 ? (
                      customArray.map((value, index) => (
                        <div
                          key={`${value}-${index}`}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-md flex items-center justify-center text-sm sm:text-base"
                        >
                          {value}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        Drag numbers here or use the custom array input above
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={useCustomArrayForVisualization}
                      disabled={customArray.length === 0}
                      className={`px-3 py-1.5 text-white rounded-md transition-all duration-200 shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                        colorTheme === 'race'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Use Custom Array
                    </button>
                    <button
                      onClick={clearCustomArray}
                      disabled={customArray.length === 0}
                      className={`px-3 py-1.5 text-white rounded-md transition-all duration-200 shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                        colorTheme === 'race'
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Algorithm-specific controls - improved for mobile */}
              <div className="mb-4">
                {category === 'searching' && (
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative w-full sm:w-auto">
                      <input
                        type="number"
                        placeholder="Search target"
                        className="w-full sm:w-40 px-3 py-2 pl-10 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={searchTarget}
                        onChange={(e) => setSearchTarget(parseInt(e.target.value, 10))}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Value to search for in the array
                    </div>
                  </div>
                )}

                {category === 'dp' && algorithm === 'fibonacci' && (
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative w-full sm:w-auto">
                      <input
                        type="number"
                        placeholder="n"
                        className="w-full sm:w-32 px-3 py-2 pl-10 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={fibN}
                        min="1"
                        max="20"
                        onChange={(e) => setFibN(parseInt(e.target.value, 10))}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono">
                        F(n)
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Calculate up to F(n)
                    </div>
                  </div>
                )}

                {category === 'math' && algorithm === 'gcd' && (
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative w-full sm:w-auto">
                      <input
                        type="number"
                        placeholder="a"
                        className="w-full sm:w-32 px-3 py-2 pl-8 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={gcdA}
                        min="1"
                        onChange={(e) => setGcdA(parseInt(e.target.value, 10))}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono">
                        a
                      </span>
                    </div>
                    <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
                      <input
                        type="number"
                        placeholder="b"
                        className="w-full sm:w-32 px-3 py-2 pl-8 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={gcdB}
                        min="1"
                        onChange={(e) => setGcdB(parseInt(e.target.value, 10))}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono">
                        b
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Find GCD(a,b)
                    </div>
                  </div>
                )}
              </div>

              {/* Playback controls - improved for mobile */}
              <div className="flex flex-wrap gap-3 items-center">
                {console.log('Rendering play button:', { 
                  isPlaying, 
                  currentStep, 
                  stepsLength: steps.length,
                  playButtonState: isPlaying ? 'pause' : (steps.length > 0 && currentStep >= steps.length - 1) ? 'restart' : 'play'
                })}
                <button
                  onClick={handlePlayButtonClick}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md flex items-center justify-center sm:justify-start gap-2 ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : steps.length > 0 && currentStep >= steps.length - 1
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={steps.length === 0 && !array.length && category !== 'graph'}
                >
                  {isPlaying ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <rect x="6" y="4" width="3" height="12" rx="1" />
                        <rect x="11" y="4" width="3" height="12" rx="1" />
                      </svg>
                      Pause
                    </>
                  ) : steps.length > 0 && currentStep >= steps.length - 1 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Restart
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Play
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep <= 0}
                    className={`px-3 py-2 rounded-md transition-colors shadow-sm font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                      colorTheme === 'race'
                        ? 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Prev
                  </button>
                  
                  <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                    {currentStep + 1} / {steps.length}
                  </div>
                  
                  <button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                    className={`px-3 py-2 rounded-md transition-colors shadow-sm font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                      colorTheme === 'race'
                        ? 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="w-full sm:w-auto">
                  <MemoizedSpeedControl speed={speed} setSpeed={setSpeed} />
                </div>

                <button
                  onClick={() => setShowControlsModal(true)}
                  className={`px-4 py-2 rounded-md transition-colors shadow-sm font-medium flex items-center gap-2 ${
                    colorTheme === 'race'
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Visualization Settings
                </button>
              </div>
            </div>

            {/* Add visualization component */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Visualization</h2>
              
              {/* Step explanation */}
              {steps.length > 0 && currentStep < steps.length && (
                <StepExplanation 
                  step={steps[currentStep]} 
                  algorithm={algorithm} 
                  category={category} 
                />
              )}
              
              {/* Visualization area */}
              <div className="visualization-container relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {renderContent()}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <AlgorithmExplanation algorithm={algorithm} />
            <StatsPanel 
              algorithm={algorithm} 
              arraySize={array.length} 
              steps={steps.length} 
              currentStep={currentStep} 
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <VisualizationControlsModal
        isOpen={showControlsModal}
        onClose={() => setShowControlsModal(false)}
        animationStyle={animationStyle}
        setAnimationStyle={setAnimationStyle}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        elementSize={elementSize}
        setElementSize={setElementSize}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color Theme
          </label>
          <div className="flex flex-wrap gap-2">
            {['blue', 'green', 'purple', 'orange', 'red', 'race'].map((theme) => (
              <button
                key={theme}
                onClick={() => setColorTheme(theme)}
                className={`w-8 h-8 rounded-full border-2 ${
                  colorTheme === theme
                    ? 'border-gray-800 dark:border-white'
                    : 'border-transparent'
                }`}
                style={{
                  background:
                    theme === 'blue'
                      ? 'linear-gradient(to right, #3b82f6, #60a5fa)'
                      : theme === 'green'
                      ? 'linear-gradient(to right, #10b981, #34d399)'
                      : theme === 'purple'
                      ? 'linear-gradient(to right, #8b5cf6, #a78bfa)'
                      : theme === 'orange'
                      ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                      : theme === 'red'
                      ? 'linear-gradient(to right, #ef4444, #f87171)'
                      : 'linear-gradient(to right, #6366f1, #f43f5e)',
                }}
                title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
              ></button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Animation Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'default', name: 'Default' },
              { id: 'smooth', name: 'Smooth' },
              { id: 'bounce', name: 'Bounce' },
              { id: 'elastic', name: 'Elastic' },
              { id: 'emphasize', name: 'Emphasize' },
              { id: 'dramatic', name: 'Dramatic' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setAnimationStyle(style.id)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  animationStyle === style.id
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </VisualizationControlsModal>
    </div>
  );
}