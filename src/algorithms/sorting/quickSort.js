export function quickSortSteps(initialArray) {
    const steps = [];
    const array = initialArray.map(n => ({ value: n, state: 'default' }));
    
    function partition(low, high) {
      const pivot = array[high].value;
      let i = low - 1;
      
      // Mark pivot element
      array[high].state = 'pivot';
      steps.push({ 
        array: array.map(item => ({ ...item })), 
        meta: { 
          description: `Pivot selected: ${pivot}`,
          indices: [high]
        } 
      });
      
      for (let j = low; j < high; j++) {
        // Mark current element being compared
        array[j].state = 'compared';
        steps.push({ 
          array: array.map(item => ({ ...item })), 
          meta: { 
            description: `Comparing ${array[j].value} with pivot ${pivot}`,
            indices: [j, high]
          } 
        });
        
        if (array[j].value < pivot) {
          i++;
          
          // Mark elements to be swapped
          array[i].state = 'swapped';
          array[j].state = 'swapped';
          steps.push({ 
            array: array.map(item => ({ ...item })), 
            meta: { 
              description: `Swapping ${array[i].value} and ${array[j].value}`,
              indices: [i, j]
            } 
          });
          
          // Perform swap
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({ 
            array: array.map(item => ({ ...item })), 
            meta: { 
              description: `Swapped ${array[i].value} and ${array[j].value}`,
              indices: [i, j]
            } 
          });
        }
        
        // Reset states
        array.forEach(el => el.state = 'default');
        array[high].state = 'pivot'; // Keep pivot marked
      }
      
      // Mark elements for final pivot swap
      array[i + 1].state = 'swapped';
      array[high].state = 'swapped';
      steps.push({ 
        array: array.map(item => ({ ...item })), 
        meta: { 
          description: `Moving pivot to its correct position`,
          indices: [i + 1, high]
        } 
      });
      
      // Perform final swap
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({ 
        array: array.map(item => ({ ...item })), 
        meta: { 
          description: `Pivot ${pivot} placed at correct position`,
          indices: [i + 1]
        } 
      });
      
      // Reset states
      array.forEach(el => el.state = 'default');
      
      return i + 1;
    }
  
    function sort(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    }
  
    // Initial state
    steps.push({ 
      array: array.map(item => ({ ...item })), 
      meta: { description: 'Initial array' } 
    });
    
    sort(0, array.length - 1);
    return steps;
  }