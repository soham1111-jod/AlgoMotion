// components/AlgorithmExplanation.jsx
import React from 'react';
import { CodeHighlighter } from './CodeHighlighter';

export const AlgorithmExplanation = ({ algorithm }) => {
  const explanations = {
    bubble: {
      title: 'Bubble Sort',
      description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      complexity: {
        time: 'O(n²)',
        space: 'O(1)'
      },
      code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
    },
    quick: {
      title: 'Quick Sort',
      description: 'A divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot.',
      complexity: {
        time: 'O(n log n) average, O(n²) worst case',
        space: 'O(log n)'
      },
      code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
    },
    merge: {
      title: 'Merge Sort',
      description: 'A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)'
      },
      code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`
    },
    selection: {
      title: 'Selection Sort',
      description: 'A simple sorting algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
      complexity: {
        time: 'O(n²)',
        space: 'O(1)'
      },
      code: `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`
    },
    insertion: {
      title: 'Insertion Sort',
      description: 'A simple sorting algorithm that builds the final sorted array one item at a time, taking each element and inserting it into its correct position.',
      complexity: {
        time: 'O(n²)',
        space: 'O(1)'
      },
      code: `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}`
    },
    linear: {
      title: 'Linear Search',
      description: 'A simple search algorithm that checks each element of the list until a match is found or the whole list has been searched.',
      complexity: {
        time: 'O(n)',
        space: 'O(1)'
      },
      code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`
    },
    binary: {
      title: 'Binary Search',
      description: 'An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
      complexity: {
        time: 'O(log n)',
        space: 'O(1)'
      },
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`
    },
    bfs: {
      title: 'Breadth-First Search',
      description: 'A graph traversal algorithm that explores all the vertices of a graph at the present depth prior to moving on to vertices at the next depth level.',
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)'
      },
      code: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    result.push(currentNode);
    
    for (const neighbor of graph[currentNode]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`
    },
    dfs: {
      title: 'Depth-First Search',
      description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)'
      },
      code: `function dfs(graph, startNode) {
  const visited = new Set();
  const result = [];
  
  function dfsHelper(node) {
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(startNode);
  return result;
}`
    },
    fibonacci: {
      title: 'Fibonacci Sequence',
      description: 'A sequence where each number is the sum of the two preceding ones, starting from 0 and 1.',
      complexity: {
        time: 'O(n)',
        space: 'O(n)'
      },
      code: `function fibonacci(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`
    },
    gcd: {
      title: 'Greatest Common Divisor',
      description: 'The Euclidean algorithm efficiently finds the largest positive integer that divides two numbers without a remainder.',
      complexity: {
        time: 'O(log min(a, b))',
        space: 'O(1)'
      },
      code: `function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`
    }
  };

  const explanation = explanations[algorithm] || {
    title: 'Algorithm',
    description: 'Select an algorithm to see its explanation.',
    complexity: { time: 'N/A', space: 'N/A' },
    code: ''
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">{explanation.title} Explanation</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{explanation.description}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Time Complexity</h3>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
            {explanation.complexity.time}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Space Complexity</h3>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
            {explanation.complexity.space}
          </div>
        </div>
      </div>
      
      <div className="mb-2 text-sm font-medium">Implementation</div>
      <CodeHighlighter code={explanation.code} />
    </div>
  );
};