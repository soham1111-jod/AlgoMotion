import { useState, useEffect, useRef } from 'react';
import { bubbleSortSteps } from '../../algorithms/sorting/bubbleSort';
import { quickSortSteps } from '../../algorithms/sorting/quickSort';
import { mergeSortSteps } from '../../algorithms/sorting/mergeSort';
import { selectionSortSteps } from '../../algorithms/sorting/selectionSort';
import { insertionSortSteps } from '../../algorithms/sorting/insertionSort';
import { linearSearchSteps } from '../../algorithms/searching/linearSearch';
import { binarySearchSteps } from '../../algorithms/searching/binarySearch';
import { fibonacciSteps } from '../../algorithms/dp/fibonacci';
import { gcdSteps } from '../../algorithms/math/gcd';
import { ComparisonSelector } from '../../components/ComparisonSelector';
import { SpeedControl } from '../../components/SpeedControl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

function RaceMode() {
    const [array, setArray] = useState([]);
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedAlgorithms, setSelectedAlgorithms] = useState(['bubble', 'quick', 'merge']);
    const [speed, setSpeed] = useState(10); // Lower is faster
    const [progress, setProgress] = useState({});
    const [customInput, setCustomInput] = useState('');
    const [category, setCategory] = useState('sorting');
    const [searchTarget, setSearchTarget] = useState(50);
    const [fibN, setFibN] = useState(10);
    const [gcdA, setGcdA] = useState(48);
    const [gcdB, setGcdB] = useState(18);
    const [draggedItem, setDraggedItem] = useState(null);
    const [customArray, setCustomArray] = useState([]);
    const dropAreaRef = useRef(null);

    useEffect(() => {
        generateRandomArray();
    }, [category]);

    // Update selected algorithms when category changes
    useEffect(() => {
        // Default algorithms for each category
        const defaultAlgorithms = {
            sorting: ['bubble', 'quick', 'merge'],
            searching: ['linear', 'binary'],
            graph: ['bfs', 'dfs'],
            dp: ['fibonacci'],
            math: ['gcd']
        };
        
        setSelectedAlgorithms(defaultAlgorithms[category] || []);
    }, [category]);

    const generateRandomArray = () => {
        const arr = Array.from({length: 15}, () => Math.floor(Math.random() * 90) + 10);
        setArray(arr);
        setResults([]);
        setProgress({});
    };

    const handleCustomArray = () => {
        const numbers = customInput.split(',').map(num => {
            const parsed = parseInt(num.trim(), 10);
            return isNaN(parsed) ? null : parsed;
        }).filter(num => num !== null);

        if (numbers.length > 0) {
            setArray(numbers);
            setResults([]);
            setProgress({});
        } else {
            alert('Please enter valid numbers separated by commas (e.g., "5, 3, 7, 1")');
        }
    };

    const handleDragStart = (e, value) => {
        setDraggedItem(value);
        e.dataTransfer.setData('text/plain', value);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dropAreaRef.current) {
            dropAreaRef.current.classList.add('border-blue-500');
            dropAreaRef.current.classList.remove('border-gray-300', 'dark:border-gray-600');
        }
    };

    const handleDragLeave = () => {
        if (dropAreaRef.current) {
            dropAreaRef.current.classList.remove('border-blue-500');
            dropAreaRef.current.classList.add('border-gray-300', 'dark:border-gray-600');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const value = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(value)) {
            setCustomArray(prev => [...prev, value]);
        }
        setDraggedItem(null);
        
        if (dropAreaRef.current) {
            dropAreaRef.current.classList.remove('border-blue-500');
            dropAreaRef.current.classList.add('border-gray-300', 'dark:border-gray-600');
        }
    };

    const useCustomArrayForRace = () => {
        if (customArray.length > 0) {
            setArray(customArray);
            setResults([]);
            setProgress({});
        } else {
            alert('Please drag at least one number to the drop area');
        }
    };

    const clearCustomArray = () => {
        setCustomArray([]);
    };

    const algorithmMap = {
        sorting: {
            'bubble': {
                name: 'Bubble Sort',
                function: bubbleSortSteps,
                color: 'bg-blue-500'
            },
            'selection': {
                name: 'Selection Sort',
                function: selectionSortSteps,
                color: 'bg-red-500'
            },
            'insertion': {
                name: 'Insertion Sort',
                function: insertionSortSteps,
                color: 'bg-orange-500'
            },
            'quick': {
                name: 'Quick Sort',
                function: quickSortSteps,
                color: 'bg-green-500'
            },
            'merge': {
                name: 'Merge Sort',
                function: mergeSortSteps,
                color: 'bg-purple-500'
            }
        },
        searching: {
            'linear': {
                name: 'Linear Search',
                function: (arr) => linearSearchSteps(arr, searchTarget),
                color: 'bg-blue-500'
            },
            'binary': {
                name: 'Binary Search',
                function: (arr) => binarySearchSteps(arr, searchTarget),
                color: 'bg-green-500'
            }
        },
        dp: {
            'fibonacci': {
                name: 'Fibonacci Sequence',
                function: () => fibonacciSteps(fibN),
                color: 'bg-yellow-500'
            }
        },
        math: {
            'gcd': {
                name: 'GCD (Euclidean)',
                function: () => gcdSteps(gcdA, gcdB),
                color: 'bg-indigo-500'
            }
        }
    };

    const runRace = async () => {
        if (!selectedAlgorithms || selectedAlgorithms.length === 0) {
            alert('Please select at least one algorithm');
            return;
        }

        setIsRunning(true);
        setResults([]);
        
        // Initialize progress for each algorithm
        const initialProgress = {};
        selectedAlgorithms.forEach(algo => {
            initialProgress[algo] = 0;
        });
        setProgress(initialProgress);
        
        // Get steps for each algorithm
        const algorithmsData = {};
        
        selectedAlgorithms.forEach(algo => {
            const algoConfig = algorithmMap[category][algo];
            if (!algoConfig) return;
            
            let input;
            if (category === 'sorting' || category === 'searching') {
                input = [...array];
            } else {
                input = null; // For algorithms that don't use array input
            }
            
            const steps = algoConfig.function(input);
            algorithmsData[algo] = {
                steps,
                totalSteps: steps.length,
                currentStep: 0,
                startTime: performance.now(),
                endTime: null
            };
        });
        
        // Simulate the race with different speeds based on algorithm efficiency
        const raceInterval = setInterval(() => {
            let allDone = true;
            
            selectedAlgorithms.forEach(algo => {
                const data = algorithmsData[algo];
                if (!data) return;
                
                if (data.currentStep < data.totalSteps - 1) {
                    allDone = false;
                    
                    // Simulate different speeds based on algorithm efficiency
                    let stepIncrement = 1;
                    if (category === 'sorting' && (algo === 'quick' || algo === 'merge')) {
                        // Quick and merge sort are generally faster
                        stepIncrement = Math.floor(Math.random() * 3) + 1;
                    }
                    
                    data.currentStep = Math.min(data.currentStep + stepIncrement, data.totalSteps - 1);
                    
                    // Update progress - ensure it reaches 100% when at the last step
                    setProgress(prev => ({
                        ...prev,
                        [algo]: data.currentStep >= data.totalSteps - 1 
                            ? 100 
                            : Math.round((data.currentStep / (data.totalSteps - 1)) * 100)
                    }));
                    
                    // Check if algorithm just finished
                    if (data.currentStep >= data.totalSteps - 1 && !data.endTime) {
                        data.endTime = performance.now();
                        
                        // Add to results when an algorithm finishes
                        setResults(prev => [
                            ...prev,
                            {
                                algorithm: algo,
                                name: algorithmMap[category][algo].name,
                                time: data.endTime - data.startTime,
                                steps: data.totalSteps
                            }
                        ]);
                    }
                } else if (!data.endTime) {
                    // Ensure algorithms that are already at the last step get 100% progress
                    setProgress(prev => ({
                        ...prev,
                        [algo]: 100
                    }));
                    
                    data.endTime = performance.now();
                    setResults(prev => [
                        ...prev,
                        {
                            algorithm: algo,
                            name: algorithmMap[category][algo].name,
                            time: data.endTime - data.startTime,
                            steps: data.totalSteps
                        }
                    ]);
                }
            });
            
            if (allDone) {
                clearInterval(raceInterval);
                setIsRunning(false);
            }
        }, speed * 10); // Adjust speed based on the speed control
        
        return () => clearInterval(raceInterval);
    };

    // Add this function to get algorithm explanations
    const getAlgorithmExplanation = (algorithm) => {
        const explanations = {
            bubble: {
                name: "Bubble Sort",
                description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)",
                bestFor: "Small datasets or nearly sorted arrays",
                worstFor: "Large unsorted datasets"
            },
            selection: {
                name: "Selection Sort",
                description: "Divides the array into a sorted and unsorted part, repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)",
                bestFor: "Small datasets with minimal memory usage",
                worstFor: "Large datasets requiring efficiency"
            },
            insertion: {
                name: "Insertion Sort",
                description: "Builds the sorted array one item at a time, taking each element and inserting it into its correct position.",
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)",
                bestFor: "Small datasets or nearly sorted arrays",
                worstFor: "Large unsorted datasets"
            },
            merge: {
                name: "Merge Sort",
                description: "Divides the array into halves, sorts each half, then merges them back together.",
                timeComplexity: "O(n log n)",
                spaceComplexity: "O(n)",
                bestFor: "Large datasets requiring stable sorting",
                worstFor: "Memory-constrained environments"
            },
            quick: {
                name: "Quick Sort",
                description: "Selects a 'pivot' element and partitions the array around it, recursively sorting the sub-arrays.",
                timeComplexity: "O(n log n) average, O(n²) worst case",
                spaceComplexity: "O(log n)",
                bestFor: "Large datasets with good pivot selection",
                worstFor: "Already sorted arrays with poor pivot selection"
            }
        };
        
        return explanations[algorithm] || {
            name: algorithm,
            description: "No detailed explanation available.",
            timeComplexity: "Unknown",
            spaceComplexity: "Unknown",
            bestFor: "Unknown",
            worstFor: "Unknown"
        };
    };

    // Add this function to calculate and display performance metrics
    const calculatePerformanceMetrics = (results) => {
        if (!results || results.length === 0) return null;
        
        // Find the fastest algorithm
        const fastestAlgo = [...results].sort((a, b) => a.time - b.time)[0];
        
        // Calculate relative performance compared to the fastest
        return results.map(result => {
            const relativeSpeed = (result.time / fastestAlgo.time).toFixed(2);
            const efficiency = (fastestAlgo.time / result.time * 100).toFixed(0);
            
            return {
                ...result,
                relativeSpeed,
                efficiency,
                isFastest: result.algorithm === fastestAlgo.algorithm
            };
        });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Algorithm Race Mode</h1>
            
            <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="w-full sm:w-auto">
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sorting">Sorting</SelectItem>
                                <SelectItem value="searching">Searching</SelectItem>
                                <SelectItem value="dp">Dynamic Programming</SelectItem>
                                <SelectItem value="math">Mathematical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                
                    <button 
                        onClick={generateRandomArray}
                        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white rounded-md hover:from-gray-600 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                        disabled={isRunning}
                    >
                        <span>🔄</span> Generate New Array
                    </button>
                    
                    {(category === 'sorting' || category === 'searching') && (
                        <div className="flex gap-2 items-center w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="text"
                                    placeholder="Enter numbers (e.g., 5,3,7)"
                                    className="px-3 py-2 pl-9 border rounded-md w-full sm:w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    disabled={isRunning}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔢
                                </span>
                            </div>
                            <button
                                onClick={handleCustomArray}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
                                disabled={isRunning}
                            >
                                <span>✓</span> Use Custom
                            </button>
                        </div>
                    )}
                    
                    {category === 'searching' && (
                        <div className="flex gap-2 items-center w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="number"
                                    placeholder="Target value"
                                    className="px-3 py-2 pl-9 border rounded-md w-full sm:w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={searchTarget}
                                    onChange={(e) => setSearchTarget(parseInt(e.target.value, 10))}
                                    disabled={isRunning}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🎯
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                Target value
                            </div>
                        </div>
                    )}

                    {category === 'dp' && (
                        <div className="flex gap-2 items-center w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="number"
                                    placeholder="n"
                                    className="px-3 py-2 pl-9 border rounded-md w-full sm:w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={fibN}
                                    min="1"
                                    max="20"
                                    onChange={(e) => setFibN(parseInt(e.target.value, 10))}
                                    disabled={isRunning}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    Fn
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                Calculate up to F(n)
                            </div>
                        </div>
                    )}

                    {category === 'math' && (
                        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="number"
                                    placeholder="a"
                                    className="px-3 py-2 pl-7 border rounded-md w-full sm:w-28 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={gcdA}
                                    min="1"
                                    onChange={(e) => setGcdA(parseInt(e.target.value, 10))}
                                    disabled={isRunning}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    a
                                </span>
                            </div>
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="number"
                                    placeholder="b"
                                    className="px-3 py-2 pl-7 border rounded-md w-full sm:w-28 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={gcdB}
                                    min="1"
                                    onChange={(e) => setGcdB(parseInt(e.target.value, 10))}
                                    disabled={isRunning}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    b
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                Find GCD(a,b)
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={runRace} 
                        disabled={isRunning}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white rounded-md hover:from-emerald-600 hover:to-green-700 dark:hover:from-emerald-700 dark:hover:to-green-800 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <span>{isRunning ? '⏳' : '🏁'}</span> {isRunning ? 'Racing...' : 'Start Race'}
                    </button>
                    
                    <div className="w-full sm:w-auto">
                        <SpeedControl speed={speed} setSpeed={setSpeed} />
                    </div>
                </div>
                
                <div className="bg-muted p-3 sm:p-4 rounded-lg">
                    <h2 className="text-base sm:text-lg font-medium mb-2">Select Algorithms to Race</h2>
                    <ComparisonSelector 
                        category={category}
                        selectedAlgorithms={selectedAlgorithms}
                        onSelect={setSelectedAlgorithms}
                    />
                </div>
                
                {/* Array visualization - only show for sorting and searching */}
                {(category === 'sorting' || category === 'searching') && (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center gap-1 h-40 items-end bg-muted p-4 rounded-lg relative overflow-hidden">
                            {/* Background grid lines for better visual reference */}
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={`h-${i}`} className="w-full h-px bg-gray-200 dark:bg-gray-700 absolute" style={{ top: `${25 * (i + 1)}%` }} />
                                ))}
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={`v-${i}`} className="h-full w-px bg-gray-200 dark:bg-gray-700 absolute" style={{ left: `${25 * (i + 1)}%` }} />
                                ))}
                            </div>
                            
                            {array.map((value, idx) => (
                                <div key={idx} className="flex flex-col items-center z-10">
                                    <div
                                        className="bg-blue-400 w-4 rounded-t shadow-md transform hover:scale-y-110 transition-all duration-300"
                                        style={{ height: `${value}%` }}
                                    >
                                        {value > 30 && (
                                            <span className="text-xs text-white font-bold absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                {value}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 px-1 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-mono shadow-sm">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Drag and drop array builder */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium">Drag & Drop Array Builder</h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={useCustomArrayForRace}
                                        disabled={customArray.length === 0 || isRunning}
                                        className="px-2 py-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded hover:from-indigo-600 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 disabled:opacity-50 transition-all duration-200"
                                    >
                                        Use This Array
                                    </button>
                                    <button 
                                        onClick={clearCustomArray}
                                        disabled={customArray.length === 0 || isRunning}
                                        className="px-2 py-1 text-xs bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white rounded hover:from-gray-600 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 disabled:opacity-50 transition-all duration-200"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center cursor-move hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, (i + 1) * 10)}
                                    >
                                        {(i + 1) * 10}
                                    </div>
                                ))}
                            </div>
                            <div 
                                ref={dropAreaRef}
                                className="min-h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 transition-colors"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {customArray.length === 0 ? (
                                    <div className="h-8 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        Drag elements here to build your array
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {customArray.map((value, idx) => (
                                            <div 
                                                key={idx} 
                                                className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center"
                                            >
                                                {value}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Progress bars with enhanced styling */}
                {Object.keys(progress).length > 0 && (
                    <div className="bg-muted p-4 rounded-lg">
                        <h2 className="text-lg font-medium mb-4 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Race Progress
                        </h2>
                        <div className="space-y-4">
                            {selectedAlgorithms.map(algo => (
                                algorithmMap[category][algo] && (
                                    <div key={algo} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: algorithmMap[category][algo].color.replace('bg-', '') }}></div>
                                                <span>{algorithmMap[category][algo].name}</span>
                                            </div>
                                            <span className="font-mono">{Math.round(progress[algo] || 0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`${algorithmMap[category][algo].color} h-full rounded-full transition-all duration-300 relative`}
                                                style={{ width: `${progress[algo] || 0}%` }}
                                            >
                                                {/* Add animated gradient effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Results with enhanced styling */}
            {results.length > 0 && (
                <div className="bg-muted p-4 sm:p-6 rounded-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-lg mr-2">
                            🏁
                        </span>
                        Race Results
                    </h2>
                    
                    {/* Race podium visualization */}
                    <div className="mb-6 flex items-end justify-center h-40 relative">
                        {results
                            .sort((a, b) => a.time - b.time)
                            .slice(0, 3)
                            .map((result, idx) => {
                                const heights = [100, 80, 60]; // Heights for 1st, 2nd, 3rd place
                                const positions = [1, 0, 2]; // Center, Left, Right
                                const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-700']; // Gold, Silver, Bronze
                                
                                return (
                                    <div 
                                        key={result.algorithm} 
                                        className="flex flex-col items-center absolute bottom-0 transition-all duration-500"
                                        style={{ 
                                            height: `${heights[idx]}%`,
                                            left: `${positions[idx] * 33 + 33}%`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    >
                                        <div className="text-center mb-2">
                                            <div className="text-xs font-bold">{result.name}</div>
                                            <div className="text-xs font-mono">{result.time.toFixed(2)}ms</div>
                                        </div>
                                        <div 
                                            className={`${colors[idx]} w-16 rounded-t-lg shadow-lg flex items-center justify-center text-white font-bold`}
                                            style={{ height: '100%' }}
                                        >
                                            {idx + 1}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    
                    <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse text-sm sm:text-base">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-2 text-left">Rank</th>
                                    <th className="p-2 text-left">Algorithm</th>
                                    <th className="p-2 text-left">Time (ms)</th>
                                    <th className="p-2 text-left">Steps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results
                                    .sort((a, b) => a.time - b.time)
                                    .map((result, index) => (
                                        <tr 
                                            key={result.algorithm} 
                                            className={`${
                                                index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''
                                            } border-t border-gray-200 dark:border-gray-700`}
                                        >
                                            <td className="p-2">
                                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                                    index === 0 ? 'bg-yellow-500' : 
                                                    index === 1 ? 'bg-gray-400' : 
                                                    index === 2 ? 'bg-amber-700' : 'bg-gray-200 dark:bg-gray-700'
                                                } text-white font-bold text-xs`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="p-2">{result.name}</td>
                                            <td className="p-2 font-mono">{result.time.toFixed(2)}ms</td>
                                            <td className="p-2">{result.steps}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {results
                            .sort((a, b) => a.time - b.time)
                            .map((result, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-3 sm:p-4 rounded-lg ${idx === 0 
                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700' : 
                                        'bg-gray-100 dark:bg-gray-800'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {idx === 0 && <span className="text-xl sm:text-2xl">🏆</span>}
                                        <h3 className="text-lg sm:text-xl font-bold">{result.name}</h3>
                                    </div>
                                    <p className="text-base sm:text-lg mt-2">Time: <span className="font-mono">{result.time.toFixed(2)}ms</span></p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Steps: {result.steps}</p>
                                    {idx === 0 && <p className="mt-2 text-xs sm:text-sm font-medium text-yellow-800 dark:text-yellow-300">Winner!</p>}
                                </div>
                            ))}
                    </div>
                </div>
            )}
            
            {/* Algorithm Complexity Information */}
            {category === 'sorting' && (
                <div className="bg-muted p-4 sm:p-6 rounded-lg mt-6 sm:mt-8">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Algorithm Complexity</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm sm:text-base">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-2 text-left">Algorithm</th>
                                    <th className="p-2 text-left">Best Case</th>
                                    <th className="p-2 text-left">Average Case</th>
                                    <th className="p-2 text-left">Worst Case</th>
                                    <th className="p-2 text-left">Space Complexity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Bubble Sort</td>
                                    <td className="p-2 font-mono">O(n)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                </tr>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Selection Sort</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                </tr>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Insertion Sort</td>
                                    <td className="p-2 font-mono">O(n)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                </tr>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Quick Sort</td>
                                    <td className="p-2 font-mono">O(n log n)</td>
                                    <td className="p-2 font-mono">O(n log n)</td>
                                    <td className="p-2 font-mono">O(n²)</td>
                                    <td className="p-2 font-mono">O(log n)</td>
                                </tr>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Merge Sort</td>
                                    <td className="p-2 font-mono">O(n log n)</td>
                                    <td className="p-2 font-mono">O(n log n)</td>
                                    <td className="p-2 font-mono">O(n log n)</td>
                                    <td className="p-2 font-mono">O(n)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {category === 'searching' && (
                <div className="bg-muted p-4 sm:p-6 rounded-lg mt-6 sm:mt-8">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Algorithm Complexity</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm sm:text-base">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-2 text-left">Algorithm</th>
                                    <th className="p-2 text-left">Best Case</th>
                                    <th className="p-2 text-left">Average Case</th>
                                    <th className="p-2 text-left">Worst Case</th>
                                    <th className="p-2 text-left">Space Complexity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Linear Search</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                    <td className="p-2 font-mono">O(n)</td>
                                    <td className="p-2 font-mono">O(n)</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                </tr>
                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 font-medium">Binary Search</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                    <td className="p-2 font-mono">O(log n)</td>
                                    <td className="p-2 font-mono">O(log n)</td>
                                    <td className="p-2 font-mono">O(1)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-4">Race Analysis</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-3">Performance Comparison</h4>
                            <div className="space-y-4">
                                {calculatePerformanceMetrics(results).map((result, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${result.isFastest ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-900/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{result.algorithm}</span>
                                            <span className={`text-sm px-2 py-0.5 rounded ${result.isFastest ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                                {result.isFastest ? 'Fastest' : `${result.relativeSpeed}x slower`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                                            <div 
                                                className={`h-2.5 rounded-full ${result.isFastest ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} 
                                                style={{ width: `${result.efficiency}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>Time: {result.time.toFixed(2)}ms</span>
                                            <span>Efficiency: {result.efficiency}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-3">Algorithm Insights</h4>
                            <div className="space-y-4">
                                {selectedAlgorithms.map((algo, index) => {
                                    const explanation = getAlgorithmExplanation(algo);
                                    return (
                                        <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h5 className="font-medium mb-2">{explanation.name}</h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{explanation.description}</p>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                                    <span className="font-medium block">Time Complexity</span>
                                                    <span className="text-gray-600 dark:text-gray-300">{explanation.timeComplexity}</span>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                                    <span className="font-medium block">Space Complexity</span>
                                                    <span className="text-gray-600 dark:text-gray-300">{explanation.spaceComplexity}</span>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                                    <span className="font-medium block">Best For</span>
                                                    <span className="text-gray-600 dark:text-gray-300">{explanation.bestFor}</span>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                                    <span className="font-medium block">Worst For</span>
                                                    <span className="text-gray-600 dark:text-gray-300">{explanation.worstFor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-semibold mb-2">Race Insights</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            The performance of sorting algorithms can vary significantly based on the input data. For example:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            <li>Quick Sort is typically faster than Merge Sort for random data, but can degrade to O(n²) for already sorted data.</li>
                            <li>Bubble Sort performs well on small or nearly sorted arrays but poorly on large unsorted ones.</li>
                            <li>Merge Sort maintains consistent O(n log n) performance regardless of input data, making it reliable but memory-intensive.</li>
                            <li>Try different array sizes and patterns to see how each algorithm responds!</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Add this to the component's return statement, before the race controls */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                <h3 className="text-lg font-semibold mb-2">How Algorithm Racing Works</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                    This race mode allows you to compare the real-world performance of different sorting algorithms side by side.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">1</div>
                            <span className="font-medium">Select Algorithms</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Choose two or more algorithms to compare their performance.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">2</div>
                            <span className="font-medium">Prepare Data</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Use random data or create your own custom array with drag and drop.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">3</div>
                            <span className="font-medium">Start Race</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Watch algorithms compete in real-time and analyze their performance.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RaceMode;
