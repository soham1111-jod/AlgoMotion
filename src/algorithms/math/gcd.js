// algorithms/math/gcd.js
export const gcdSteps = (a, b) => {
  if (a <= 0 || b <= 0) return [];
  
  const steps = [];
  
  // Initial state
  steps.push({
    data: [
      { value: a, state: 'current', description: 'First number' },
      { value: b, state: 'current', description: 'Second number' }
    ],
    meta: {
      description: `Starting with numbers a = ${a} and b = ${b}`
    }
  });
  
  // Euclidean algorithm
  let x = Math.max(a, b);
  let y = Math.min(a, b);
  
  while (y !== 0) {
    // Show current values
    steps.push({
      data: [
        { value: x, state: 'current', description: 'Current larger value' },
        { value: y, state: 'current', description: 'Current smaller value' }
      ],
      meta: {
        description: `Calculate remainder of ${x} ÷ ${y}`
      }
    });
    
    // Calculate remainder
    const remainder = x % y;
    
    // Show calculation step
    steps.push({
      data: [
        { value: x, state: 'default', description: 'Larger value' },
        { value: y, state: 'current', description: 'Smaller value' },
        { value: remainder, state: 'remainder', description: `Remainder of ${x} ÷ ${y}` }
      ],
      meta: {
        description: `${x} ÷ ${y} = ${Math.floor(x / y)} with remainder ${remainder}`
      }
    });
    
    // Update values
    x = y;
    y = remainder;
    
    // Show updated values
    if (y !== 0) {
      steps.push({
        data: [
          { value: x, state: 'current', description: 'New larger value' },
          { value: y, state: 'current', description: 'New smaller value' }
        ],
        meta: {
          description: `Continue with new values: ${x} and ${y}`
        }
      });
    }
  }
  
  // Final result
  steps.push({
    data: [
      { value: x, state: 'result', description: 'GCD result' }
    ],
    meta: {
      description: `GCD(${a}, ${b}) = ${x}`
    }
  });
  
  return steps;
}; 