export function aStar(grid, start, end) {
  // 8-directional movement (including diagonals)
  const dirs = [
    [0, -1], // up
    [1, -1], // up-right
    [1, 0], // right
    [1, 1], // down-right
    [0, 1], // down
    [-1, 1], // down-left
    [-1, 0], // left
    [-1, -1], // up-left
  ];

  const openSet = [start];
  const closedSet = new Set();
  const cameFrom = {};

  const startKey = `${start[0]},${start[1]}`;
  const gScore = { [startKey]: 0 };
  const fScore = { [startKey]: heuristic(start, end) };

  function heuristic(a, b) {
    // Euclidean distance heuristic
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  while (openSet.length > 0) {
    // Pick the node with the lowest fScore
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      const key = `${openSet[i][0]},${openSet[i][1]}`;
      const lowestKey = `${openSet[lowestIndex][0]},${openSet[lowestIndex][1]}`;
      if ((fScore[key] || Infinity) < (fScore[lowestKey] || Infinity)) {
        lowestIndex = i;
      }
    }

    const current = openSet.splice(lowestIndex, 1)[0];
    const currentKey = `${current[0]},${current[1]}`;

    // Mark this node as processed
    closedSet.add(currentKey);

    // Goal reached; reconstruct path
    if (current[0] === end[0] && current[1] === end[1]) {
      const path = [current];
      while (cameFrom[`${path[0][0]},${path[0][1]}`]) {
        path.unshift(cameFrom[`${path[0][0]},${path[0][1]}`]);
      }
      return path;
    }

    // Explore neighbors
    for (const [dx, dy] of dirs) {
      const neighbor = [current[0] + dx, current[1] + dy];
      const [x, y] = neighbor;
      const neighborKey = `${x},${y}`;

      // Skip if out of bounds, non-walkable, or already processed
      if (
        y < 0 ||
        y >= grid.length ||
        x < 0 ||
        x >= grid[0].length ||
        grid[y][x] === 0 ||
        closedSet.has(neighborKey)
      ) {
        continue;
      }

      // Cost: diagonal moves cost more
      const moveCost = dx !== 0 && dy !== 0 ? 1.4 : 1;
      const tentativeG = gScore[currentKey] + moveCost;

      if (tentativeG < (gScore[neighborKey] || Infinity)) {
        cameFrom[neighborKey] = current;
        gScore[neighborKey] = tentativeG;
        fScore[neighborKey] = tentativeG + heuristic(neighbor, end);
        if (!openSet.some((n) => n[0] === x && n[1] === y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path found
  return [];
}
