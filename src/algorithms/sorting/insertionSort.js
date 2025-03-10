// algorithms/sorting/insertionSort.js
export const insertionSortSteps = (initialArray) => {
  const steps = [];
  const arr = initialArray.map(n => ({ value: n, state: 'default' }));
  
  // Record initial state
  steps.push({ 
    array: [...arr], 
    meta: { description: 'Initial array' } 
  });

  // Mark first element as sorted
  arr[0].state = 'sorted';
  steps.push({ 
    array: arr.map(item => ({ ...item })), 
    meta: { 
      description: 'First element is already sorted',
      indices: [0]
    } 
  });

  for (let i = 1; i < arr.length; i++) {
    // Current element to be inserted
    const current = { ...arr[i] };
    current.state = 'pivot';
    arr[i] = current;
    
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Inserting element ${current.value} into the sorted portion`,
        indices: [i]
      } 
    });
    
    let j = i - 1;
    
    // Compare with each element in the sorted portion
    while (j >= 0) {
      // Mark element being compared
      arr[j].state = 'compared';
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `Comparing ${current.value} with ${arr[j].value}`,
          indices: [i, j]
        } 
      });
      
      if (arr[j].value > current.value) {
        // Move element to the right
        arr[j].state = 'swapped';
        arr[j + 1] = { ...arr[j] };
        
        steps.push({ 
          array: arr.map(item => ({ ...item })), 
          meta: { 
            description: `Moving ${arr[j].value} one position to the right`,
            indices: [j, j + 1]
          } 
        });
        
        j--;
      } else {
        // Element found its position
        arr[j].state = 'sorted';
        break;
      }
      
      // Reset compared state
      if (j >= 0) {
        arr[j].state = 'sorted';
      }
    }
    
    // Place current element at its correct position
    arr[j + 1] = { ...current, state: 'sorted' };
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Placed ${current.value} at position ${j + 1}`,
        indices: [j + 1]
      } 
    });
    
    // Reset states and mark sorted elements
    for (let k = 0; k <= i; k++) {
      arr[k].state = 'sorted';
    }
    
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Elements up to index ${i} are now sorted`,
        indices: Array.from({ length: i + 1 }, (_, idx) => idx)
      } 
    });
  }
  
  // Final sorted array
  steps.push({ 
    array: arr.map(item => ({ ...item })), 
    meta: { 
      description: 'Array sorted successfully',
      indices: []
    } 
  });
  
  return steps;
}; 