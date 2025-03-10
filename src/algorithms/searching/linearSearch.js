// algorithms/searching/linearSearch.js
export const linearSearchSteps = (initialArray, target) => {
  const steps = [];
  const arr = initialArray.map(n => ({ value: n, state: 'default' }));
  let comparisons = 0;
  
  // Record initial state
  steps.push({ 
    array: [...arr], 
    meta: { 
      description: `Searching for ${target} using Linear Search`,
      indices: [],
      comparisons,
      currentIndex: null,
      target
    } 
  });

  for (let i = 0; i < arr.length; i++) {
    // Mark current element being checked
    arr[i].state = 'current';
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Checking if ${arr[i].value} equals ${target}`,
        indices: [i],
        comparisons,
        currentIndex: i,
        target
      } 
    });
    
    // Increment comparison counter
    comparisons++;
    
    // Compare current element with target
    arr[i].state = 'compared';
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Comparing ${arr[i].value} with ${target}`,
        indices: [i],
        comparisons,
        currentIndex: i,
        target
      } 
    });
    
    if (arr[i].value === target) {
      // Element found
      arr[i].state = 'found';
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `Found ${target} at index ${i}`,
          indices: [i],
          found: true,
          foundIndex: i,
          comparisons,
          currentIndex: i,
          target
        } 
      });
      return steps;
    }
    
    // Element not found, mark as checked
    arr[i].state = 'checked';
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `${arr[i].value} is not equal to ${target}, moving to next element`,
        indices: [i],
        comparisons,
        currentIndex: i,
        target
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