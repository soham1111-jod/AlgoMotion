// algorithms/searching/binarySearch.js
export const binarySearchSteps = (initialArray, target) => {
  const steps = [];
  // Binary search requires a sorted array
  const sortedArray = [...initialArray].sort((a, b) => a - b);
  const arr = sortedArray.map(n => ({ value: n, state: 'default' }));
  let comparisons = 0;
  
  // Record initial state
  steps.push({ 
    array: [...arr], 
    meta: { 
      description: `Searching for ${target} using Binary Search on sorted array`,
      indices: [],
      isSorted: true,
      comparisons,
      currentIndex: null,
      target,
      range: [{ left: 0, right: arr.length - 1 }]
    } 
  });

  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Mark current search range
    for (let i = left; i <= right; i++) {
      arr[i].state = 'range';
    }
    
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Current search range: indices ${left} to ${right}`,
        indices: [left, right],
        comparisons,
        currentIndex: null,
        target,
        range: [{ left, right }]
      } 
    });
    
    const mid = Math.floor((left + right) / 2);
    
    // Mark middle element
    arr[mid].state = 'current';
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Selected middle element at index ${mid}`,
        indices: [mid],
        comparisons,
        currentIndex: mid,
        target,
        mid,
        range: [{ left, right }]
      } 
    });
    
    // Increment comparison counter
    comparisons++;
    
    // Compare middle element with target
    arr[mid].state = 'compared';
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Comparing middle element ${arr[mid].value} at index ${mid} with target ${target}`,
        indices: [mid],
        comparisons,
        currentIndex: mid,
        target,
        mid,
        range: [{ left, right }]
      } 
    });
    
    if (arr[mid].value === target) {
      // Element found
      arr[mid].state = 'found';
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `Found ${target} at index ${mid}`,
          indices: [mid],
          found: true,
          foundIndex: mid,
          comparisons,
          currentIndex: mid,
          target,
          mid,
          range: [{ left, right }]
        } 
      });
      return steps;
    } else if (arr[mid].value < target) {
      // Target is in the right half
      // Reset states
      arr.forEach(el => el.state = 'default');
      
      // Mark elements in the left half as eliminated
      for (let i = left; i <= mid; i++) {
        arr[i].state = 'eliminated';
      }
      
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `${arr[mid].value} < ${target}, searching in the right half`,
          indices: [mid],
          comparisons,
          currentIndex: mid,
          target,
          mid,
          range: [{ left: mid + 1, right }]
        } 
      });
      
      left = mid + 1;
    } else {
      // Target is in the left half
      // Reset states
      arr.forEach(el => el.state = 'default');
      
      // Mark elements in the right half as eliminated
      for (let i = mid; i <= right; i++) {
        arr[i].state = 'eliminated';
      }
      
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `${arr[mid].value} > ${target}, searching in the left half`,
          indices: [mid],
          comparisons,
          currentIndex: mid,
          target,
          mid,
          range: [{ left, right: mid - 1 }]
        } 
      });
      
      right = mid - 1;
    }
    
    // Reset states for next iteration
    arr.forEach(el => {
      if (el.state !== 'eliminated') {
        el.state = 'default';
      }
    });
  }
  
  // Target not found
  steps.push({ 
    array: arr.map(item => ({ ...item })), 
    meta: { 
      description: `${target} not found in the array after ${comparisons} comparisons`,
      indices: [],
      found: false,
      notFound: true,
      comparisons,
      currentIndex: null,
      target
    } 
  });
  
  return steps;
}; 