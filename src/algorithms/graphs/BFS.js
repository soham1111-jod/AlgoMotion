// algorithms/graph/BFS.js
import { visualizeGraphStep } from '../../utils/graphUtils';

export const bfs = (graph) => {
  if (!graph || !graph.nodes || !graph.edges) {
    return [];
  }

  const steps = [];
  const startNode = graph.nodes[0]?.id; // Start from the first node
  
  if (!startNode) {
    return [];
  }
  
  // Create a deep copy of the graph for visualization
  const createGraphState = () => {
    const nodes = graph.nodes.map(node => ({
      ...node,
      state: 'default'
    }));
    
    const edges = graph.edges.map(edge => ({
      ...edge,
      state: 'default'
    }));
    
    return { nodes, edges };
  };
  
  // Initial state
  const initialState = createGraphState();
  steps.push({
    data: initialState,
    meta: {
      description: 'Initial graph state. Starting BFS from node ' + startNode
    }
  });
  
  // Create adjacency list from edges
  const adjacencyList = {};
  graph.nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });
  
  graph.edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    // For undirected graph, add the reverse edge as well
    adjacencyList[edge.target].push(edge.source);
  });
  
  // BFS algorithm
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);
  
  // Mark start node as current
  const startState = createGraphState();
  startState.nodes.find(n => n.id === startNode).state = 'current';
  steps.push({
    data: startState,
    meta: {
      description: `Starting BFS from node ${startNode}. Add ${startNode} to the queue.`
    }
  });
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    
    // Mark current node as visited
    const visitedState = createGraphState();
    visitedState.nodes.forEach(node => {
      if (visited.has(node.id)) {
        node.state = node.id === currentNode ? 'current' : 'visited';
      }
      if (queue.includes(node.id)) {
        node.state = 'queued';
      }
    });
    
    steps.push({
      data: visitedState,
      meta: {
        description: `Dequeue node ${currentNode} and mark it as visited.`
      }
    });
    
    // Process neighbors
    for (const neighbor of adjacencyList[currentNode]) {
      if (!visited.has(neighbor)) {
        // Mark edge as being traversed
        const traverseState = createGraphState();
        traverseState.nodes.forEach(node => {
          if (visited.has(node.id)) {
            node.state = node.id === currentNode ? 'current' : 'visited';
          }
          if (node.id === neighbor) {
            node.state = 'queued';
          }
          if (queue.includes(node.id)) {
            node.state = 'queued';
          }
        });
        
        traverseState.edges.forEach(edge => {
          if (edge.source === currentNode && edge.target === neighbor || 
              edge.target === currentNode && edge.source === neighbor) {
            edge.state = 'visited';
          }
        });
        
        steps.push({
          data: traverseState,
          meta: {
            description: `Explore edge from ${currentNode} to ${neighbor}. ${neighbor} is not visited yet.`
          }
        });
        
        // Add neighbor to queue and mark as visited
        visited.add(neighbor);
        queue.push(neighbor);
        
        const queueState = createGraphState();
        queueState.nodes.forEach(node => {
          if (visited.has(node.id)) {
            node.state = node.id === currentNode ? 'current' : 'visited';
          }
          if (queue.includes(node.id)) {
            node.state = 'queued';
          }
        });
        
        queueState.edges.forEach(edge => {
          if ((edge.source === currentNode && edge.target === neighbor) || 
              (edge.target === currentNode && edge.source === neighbor)) {
            edge.state = 'visited';
          }
        });
        
        steps.push({
          data: queueState,
          meta: {
            description: `Add ${neighbor} to the queue. Queue now contains: [${queue.join(', ')}]`
          }
        });
      } else {
        // Already visited neighbor
        const alreadyVisitedState = createGraphState();
        alreadyVisitedState.nodes.forEach(node => {
          if (visited.has(node.id)) {
            node.state = node.id === currentNode ? 'current' : 'visited';
          }
          if (queue.includes(node.id)) {
            node.state = 'queued';
          }
        });
        
        steps.push({
          data: alreadyVisitedState,
          meta: {
            description: `Neighbor ${neighbor} is already visited, so we skip it.`
          }
        });
      }
    }
  }
  
  // Final state
  const finalState = createGraphState();
  finalState.nodes.forEach(node => {
    if (visited.has(node.id)) {
      node.state = 'visited';
    }
  });
  
  steps.push({
    data: finalState,
    meta: {
      description: `BFS traversal complete. Visited nodes: [${Array.from(visited).join(', ')}]`
    }
  });
  
  return steps;
};