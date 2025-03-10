// algorithms/sorting/mergeSort.js
export const mergeSortSteps = (initialArray) => {
  const steps = [];
  const array = initialArray.map(num => ({ value: num, state: 'default' }));
  
  // Record initial state
  steps.push({ 
    array: array.map(item => ({ ...item })), 
    meta: { description: 'Initial array' } 
  });

  function mergeSortHelper(start, end) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    
    // Highlight the subarrays being divided
    for (let i = start; i <= end; i++) {
      array[i].state = 'compared';
    }
    steps.push({ 
      array: array.map(item => ({ ...item })), 
      meta: { 
        description: `Dividing array from index ${start} to ${end}`,
        indices: [start, end]
      } 
    });
    
    // Reset states
    array.forEach(el => el.state = 'default');
    
    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start, mid, end) {
    // Highlight the subarrays being merged
    for (let i = start; i <= mid; i++) {
      array[i].state = 'compared';
    }
    for (let i = mid + 1; i <= end; i++) {
      array[i].state = 'pivot'; // Using pivot color for right subarray
    }
    
    steps.push({ 
      array: array.map(item => ({ ...item })), 
      meta: { 
        description: `Merging subarrays from ${start}-${mid} and ${mid+1}-${end}`,
        indices: [start, mid, end]
      } 
    });
    
    // Reset states
    array.forEach(el => el.state = 'default');
    
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    
    while (i < left.length && j < right.length) {
      // Highlight elements being compared
      array[start + i].state = 'compared';
      array[mid + 1 + j].state = 'compared';
      
      steps.push({ 
        array: array.map(item => ({ ...item })), 
        meta: { 
          description: `Comparing ${left[i].value} and ${right[j].value}`,
          indices: [start + i, mid + 1 + j]
        } 
      });
      
      if (left[i].value <= right[j].value) {
        // Mark element being placed
        array[k].state = 'swapped';
        array[k] = { ...left[i], state: 'swapped' };
        
        steps.push({ 
          array: array.map(item => ({ ...item })), 
          meta: { 
            description: `Placing ${left[i].value} at position ${k}`,
            indices: [k]
          } 
        });
        
        i++;
      } else {
        // Mark element being placed
        array[k].state = 'swapped';
        array[k] = { ...right[j], state: 'swapped' };
        
        steps.push({ 
          array: array.map(item => ({ ...item })), 
          meta: { 
            description: `Placing ${right[j].value} at position ${k}`,
            indices: [k]
          } 
        });
        
        j++;
      }
      
      // Reset states
      array.forEach(el => el.state = 'default');
      k++;
    }

    // Add remaining elements from left subarray
    while (i < left.length) {
      array[k].state = 'swapped';
      array[k] = { ...left[i], state: 'swapped' };
      
      steps.push({ 
        array: array.map(item => ({ ...item })), 
        meta: { 
          description: `Placing remaining element ${left[i].value} at position ${k}`,
          indices: [k]
        } 
      });
      
      // Reset states
      array.forEach(el => el.state = 'default');
      i++;
      k++;
    }

    // Add remaining elements from right subarray
    while (j < right.length) {
      array[k].state = 'swapped';
      array[k] = { ...right[j], state: 'swapped' };
      
      steps.push({ 
        array: array.map(item => ({ ...item })), 
        meta: { 
          description: `Placing remaining element ${right[j].value} at position ${k}`,
          indices: [k]
        } 
      });
      
      // Reset states
      array.forEach(el => el.state = 'default');
      j++;
      k++;
    }
  }

  mergeSortHelper(0, array.length - 1);
  
  // Final sorted array
  steps.push({ 
    array: array.map(item => ({ ...item })), 
    meta: { description: 'Array sorted successfully' } 
  });
  
  return steps;
};
