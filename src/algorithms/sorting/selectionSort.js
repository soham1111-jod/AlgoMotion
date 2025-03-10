// algorithms/sorting/selectionSort.js
export const selectionSortSteps = (initialArray) => {
  const steps = [];
  const arr = initialArray.map(n => ({ value: n, state: 'default' }));
  
  // Record initial state
  steps.push({ 
    array: [...arr], 
    meta: { description: 'Initial array' } 
  });

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    
    // Mark current position
    arr[i].state = 'pivot';
    steps.push({ 
      array: arr.map(item => ({ ...item })), 
      meta: { 
        description: `Finding minimum element to place at position ${i}`,
        indices: [i]
      } 
    });
    
    // Find minimum element
    for (let j = i + 1; j < arr.length; j++) {
      // Mark element being compared
      arr[j].state = 'compared';
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `Comparing ${arr[j].value} with current minimum ${arr[minIndex].value}`,
          indices: [j, minIndex]
        } 
      });
      
      if (arr[j].value < arr[minIndex].value) {
        // Reset previous minimum
        if (minIndex !== i) {
          arr[minIndex].state = 'default';
        }
        
        minIndex = j;
        arr[minIndex].state = 'swapped';
        steps.push({ 
          array: arr.map(item => ({ ...item })), 
          meta: { 
            description: `New minimum found: ${arr[minIndex].value}`,
            indices: [minIndex]
          } 
        });
      } else {
        // Reset compared state
        arr[j].state = 'default';
      }
    }
    
    // Swap elements if needed
    if (minIndex !== i) {
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `Swapping ${arr[i].value} and ${arr[minIndex].value}`,
          indices: [i, minIndex]
        } 
      });
      
      // Perform swap
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `Placed ${arr[i].value} at sorted position ${i}`,
          indices: [i]
        } 
      });
    } else {
      steps.push({ 
        array: arr.map(item => ({ ...item })), 
        meta: { 
          description: `${arr[i].value} is already at the correct position ${i}`,
          indices: [i]
        } 
      });
    }
    
    // Reset states and mark sorted element
    arr.forEach(el => el.state = 'default');
    arr[i].state = 'sorted';
  }
  
  // Mark the last element as sorted
  arr[arr.length - 1].state = 'sorted';
  steps.push({ 
    array: arr.map(item => ({ ...item })), 
    meta: { 
      description: 'Array sorted successfully',
      indices: []
    } 
  });
  
  return steps;
}; 