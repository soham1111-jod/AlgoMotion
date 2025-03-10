// algorithms/dp/fibonacci.js
export const fibonacciSteps = (n) => {
  if (n < 0) return [];
  
  const steps = [];
  
  // Initial state
  steps.push({
    data: [
      { index: 0, value: 0, state: 'calculated' },
      { index: 1, value: 1, state: 'calculated' }
    ],
    meta: {
      description: 'Starting with the base cases: F(0) = 0 and F(1) = 1'
    }
  });
  
  if (n <= 1) {
    // Final step for base cases
    const finalData = steps[steps.length - 1].data.map(item => ({
      ...item,
      state: item.index === n ? 'result' : 'calculated'
    }));
    
    steps.push({
      data: finalData,
      meta: {
        description: `Final result: F(${n}) = ${n === 0 ? 0 : 1}`
      }
    });
    
    return steps;
  }
  
  // Calculate Fibonacci numbers iteratively
  let fib = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    // Show current calculation
    const currentData = [];
    
    // Add previous calculated values
    for (let j = 0; j < fib.length; j++) {
      currentData.push({
        index: j,
        value: fib[j],
        state: j === i - 1 || j === i - 2 ? 'current' : 'calculated'
      });
    }
    
    steps.push({
      data: currentData,
      meta: {
        description: `Calculating F(${i}) = F(${i-1}) + F(${i-2}) = ${fib[i-1]} + ${fib[i-2]}`
      }
    });
    
    // Calculate new value
    const newValue = fib[i - 1] + fib[i - 2];
    fib.push(newValue);
    
    // Show result of calculation
    const resultData = [];
    
    // Add all values including the new one
    for (let j = 0; j <= i; j++) {
      resultData.push({
        index: j,
        value: fib[j],
        state: j === i ? 'current' : 'calculated'
      });
    }
    
    steps.push({
      data: resultData,
      meta: {
        description: `F(${i}) = ${newValue}`
      }
    });
  }
  
  // Final step
  const finalData = [];
  for (let i = 0; i <= n; i++) {
    finalData.push({
      index: i,
      value: fib[i],
      state: i === n ? 'result' : 'calculated'
    });
  }
  
  steps.push({
    data: finalData,
    meta: {
      description: `Final result: F(${n}) = ${fib[n]}`
    }
  });
  
  return steps;
}; 