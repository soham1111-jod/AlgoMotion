export const bubbleSortSteps = (initialArray) => {
  // Create a deep copy of the array with state information
  const steps = [];
  const arr = initialArray.map(value => ({ value, state: 'default' }));
  
  // Add initial state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    meta: {
      description: 'Initial array',
      indices: []
    }
  });

  // Bubble sort algorithm with visualization steps
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Reset states from previous iteration
      arr.forEach(item => item.state = 'default');
      
      // Mark elements that are already sorted
      for (let k = n - 1; k >= n - i; k--) {
        arr[k].state = 'sorted';
      }
      
      // Mark elements being compared
      arr[j].state = 'compared';
      arr[j + 1].state = 'compared';
      
      // Add comparison step
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        meta: {
          description: `Comparing elements at positions ${j} (${arr[j].value}) and ${j + 1} (${arr[j + 1].value})`,
          indices: [j, j + 1]
        }
      });
      
      // If elements are in wrong order, swap them
      if (arr[j].value > arr[j + 1].value) {
        // Mark elements to be swapped
        arr[j].state = 'swapped';
        arr[j + 1].state = 'swapped';
        
        // Add pre-swap step
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          meta: {
            description: `Elements at positions ${j} (${arr[j].value}) and ${j + 1} (${arr[j + 1].value}) need to be swapped`,
            indices: [j, j + 1]
          }
        });
        
        // Perform the swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        
        // Keep the swapped state
        arr[j].state = 'swapped';
        arr[j + 1].state = 'swapped';
        
        // Add post-swap step
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          meta: {
            description: `Swapped elements: ${arr[j].value} and ${arr[j + 1].value}`,
            indices: [j, j + 1]
          }
        });
      }
    }
    
    // After each pass, mark the largest element as sorted
    arr.forEach(item => item.state = 'default');
    
    // Mark sorted elements
    for (let k = n - 1; k >= n - i - 1; k--) {
      arr[k].state = 'sorted';
    }
    
    // Add step after each pass
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      meta: {
        description: `Completed pass ${i + 1}. The largest ${i + 1} element${i > 0 ? 's are' : ' is'} now sorted.`,
        indices: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx)
      }
    });
  }
  
  // Mark all elements as sorted for the final state
  arr.forEach(item => item.state = 'sorted');
  
  // Add final sorted state
  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    meta: {
      description: 'Array is now fully sorted',
      indices: Array.from({ length: n }, (_, idx) => idx)
    }
  });
  
  return steps;
};