// algorithms/graph/DFS.js
export const dfs = (graph) => {
  if (!graph || !graph.nodes || !graph.edges) {
    return [];
  }

  const steps = [];
  const visited = new Set();
  const visitedEdges = new Set(); // Track visited edges for persistent highlighting
  const stack = [];
  const startNode = graph.nodes[0]?.id;
  if (startNode === undefined) return [];
  stack.push(startNode);

  // Helper to create a unique key for an edge (undirected)
  const edgeKey = (a, b) => a < b ? `${a}-${b}` : `${b}-${a}`;

  // Helper to create a deep copy of the graph state with node/edge states
  const createGraphState = (currentId, visitedSet, stackArr, highlightEdge = null) => {
    return {
      nodes: graph.nodes.map(node => ({
        ...node,
        state: currentId === node.id
          ? 'current'
          : visitedSet.has(node.id)
          ? 'visited'
          : stackArr.includes(node.id)
          ? 'stacked'
          : 'default'
      })),
      edges: graph.edges.map(edge => {
        let state = 'default';
        const key = edgeKey(edge.source, edge.target);
        if (highlightEdge &&
          ((edge.source === highlightEdge[0] && edge.target === highlightEdge[1]) ||
            (edge.target === highlightEdge[0] && edge.source === highlightEdge[1]))
        ) {
          state = 'current'; // currently traversed edge
        } else if (visitedEdges.has(key)) {
          state = 'visited'; // previously traversed edge
        }
        return {
          ...edge,
          state
        };
      })
    };
  };

  // Initial state
  steps.push({
    data: createGraphState(null, visited, stack),
    meta: {
      description: `Initial graph state. Starting DFS from node ${startNode}`
    }
  });

  while (stack.length > 0) {
    const current = stack.pop();

    // Mark current node as current
    steps.push({
      data: createGraphState(current, visited, stack),
      meta: {
        description: `Pop node ${current} from stack and process.`
      }
    });

    if (!visited.has(current)) {
      visited.add(current);
      // Mark node as visited
      steps.push({
        data: createGraphState(current, visited, stack),
        meta: {
          description: `Visiting node ${current}`
        }
      });

      // Find all neighbors of the current node
      const neighbors = [];
      graph.edges.forEach(edge => {
        const from = edge.source;
        const to = edge.target;
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
          // Mark the traversed edge as visited for future steps
          visitedEdges.add(edgeKey(current, neighbor));
          // Show neighbor being added to stack and highlight the traversed edge
          steps.push({
            data: createGraphState(current, visited, stack, [current, neighbor]),
            meta: {
              description: `Adding node ${neighbor} to the stack and traversing edge (${current}, ${neighbor}).`
            }
          });
        }
      });
    }
  }

  // Final state
  steps.push({
    data: createGraphState(null, visited, []),
    meta: {
      description: `DFS traversal complete. Visited nodes: [${Array.from(visited).join(', ')}]`
    }
  });

  return steps;
}; 