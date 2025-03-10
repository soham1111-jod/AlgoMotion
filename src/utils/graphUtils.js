// utils/graphUtils.js
export const generateRandomGraph = (nodeCount = 8) => {
  try {
    // Create nodes with positions
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      label: String.fromCharCode(65 + i), // A, B, C, etc.
      x: 100 + Math.floor(Math.random() * 400),
      y: 50 + Math.floor(Math.random() * 200),
      state: 'default'
    }));

    // Create edges
    const edges = [];
    
    // Ensure each node has at least one connection (create a connected graph)
    for (let i = 0; i < nodeCount - 1; i++) {
      edges.push({
        source: i,
        target: i + 1,
        state: 'default'
      });
    }
    
    // Connect the last node to the first to form a cycle
    edges.push({
      source: nodeCount - 1,
      target: 0,
      state: 'default'
    });

    // Add some random connections (20% probability)
    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        if (i !== j && Math.random() < 0.2) {
          // Check if this edge already exists
          const edgeExists = edges.some(
            edge => (edge.source === i && edge.target === j) || 
                   (edge.source === j && edge.target === i)
          );
          
          if (!edgeExists) {
            edges.push({
              source: i,
              target: j,
              state: 'default'
            });
          }
        }
      }
    }

    // Apply force-directed layout to prevent node overlap
    applyForceLayout(nodes, edges, 10);

    return {
      nodes,
      edges
    };
  } catch (error) {
    console.error('Error generating graph:', error);
    // Return a minimal valid graph
    return {
      nodes: [
        { id: 0, label: 'A', x: 200, y: 150, state: 'default' },
        { id: 1, label: 'B', x: 400, y: 150, state: 'default' }
      ],
      edges: [
        { source: 0, target: 1, state: 'default' }
      ]
    };
  }
};

// Simple force-directed layout to prevent node overlap
const applyForceLayout = (nodes, edges, iterations = 10) => {
  const repulsionForce = 2000; // Repulsion between nodes
  const springLength = 100;    // Ideal edge length
  const springForce = 0.1;     // Spring force constant
  
  for (let iter = 0; iter < iterations; iter++) {
    // Calculate repulsion forces between all nodes
    for (let i = 0; i < nodes.length; i++) {
      let fx = 0, fy = 0;
      
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Apply repulsion force (inverse square law)
        const force = repulsionForce / (distance * distance);
        fx += (dx / distance) * force;
        fy += (dy / distance) * force;
      }
      
      // Apply spring forces for connected nodes
      for (const edge of edges) {
        if (edge.source === i || edge.target === i) {
          const j = edge.source === i ? edge.target : edge.source;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          // Spring force (proportional to distance difference from ideal length)
          const force = springForce * (distance - springLength);
          fx -= (dx / distance) * force;
          fy -= (dy / distance) * force;
        }
      }
      
      // Apply forces to update position
      nodes[i].x += fx;
      nodes[i].y += fy;
      
      // Keep nodes within bounds
      nodes[i].x = Math.max(50, Math.min(550, nodes[i].x));
      nodes[i].y = Math.max(50, Math.min(250, nodes[i].y));
    }
  }
};

export const visualizeGraphStep = (graph, current, visited = new Set()) => {
  try {
    if (!graph || !graph.nodes || !graph.edges) {
      throw new Error('Invalid graph structure');
    }

    return {
      nodes: graph.nodes.map(node => ({
        ...node,
        state: current === node.id ? 'current' : 
               visited.has(node.id) ? 'visited' : 'default'
      })),
      edges: graph.edges.map(edge => ({
        ...edge,
        state: 'default' // Update edge state as needed
      }))
    };
  } catch (error) {
    console.error('Error visualizing graph step:', error);
    // Return a minimal valid graph state
    return {
      nodes: [
        { id: 0, label: 'A', x: 200, y: 150, state: 'default' },
        { id: 1, label: 'B', x: 400, y: 150, state: 'default' }
      ],
      edges: [
        { source: 0, target: 1, state: 'default' }
      ]
    };
  }
};