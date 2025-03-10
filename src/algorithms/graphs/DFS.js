// algorithms/graph/DFS.js
export const dfs = (graph, startNode = graph.nodes[0]) => {
  const steps = [];
  const visited = new Set();
  const stack = [startNode];
  
  // Create a deep copy of the graph for visualization
  const graphCopy = {
    nodes: [...graph.nodes],
    edges: [...graph.edges]
  };
  
  // Add initial state
  steps.push({
    graph: graphCopy,
    visited: [],
    current: null,
    meta: {
      description: 'Initial graph state',
      indices: []
    }
  });
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (!visited.has(current)) {
      // Mark node as visited
      visited.add(current);
      
      // Add step showing current node being processed
      steps.push({
        graph: graphCopy,
        visited: [...visited],
        current: current,
        meta: {
          description: `Visiting node ${current}`,
          indices: [current]
        }
      });
      
      // Find all neighbors of the current node
      const neighbors = [];
      graphCopy.edges.forEach(edge => {
        const [from, to] = edge;
        if (from === current && !visited.has(to)) {
          neighbors.push(to);
        } else if (to === current && !visited.has(from)) {
          neighbors.push(from);
        }
      });
      
      // Add all unvisited neighbors to the stack (in reverse order to maintain DFS property)
      neighbors.reverse().forEach(neighbor => {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          
          // Add step showing neighbor being added to stack
          steps.push({
            graph: graphCopy,
            visited: [...visited],
            current: neighbor,
            meta: {
              description: `Adding node ${neighbor} to the stack`,
              indices: [current, neighbor]
            }
          });
        }
      });
    }
  }
  
  // Add final state
  steps.push({
    graph: graphCopy,
    visited: [...visited],
    current: null,
    meta: {
      description: 'DFS traversal complete',
      indices: [...visited]
    }
  });
  
  return steps;
}; 