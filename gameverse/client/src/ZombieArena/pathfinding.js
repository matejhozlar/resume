import TinyQueue from "tinyqueue";

export function aStar(grid, start, end) {
  const dirs = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  const heuristic = (a, b) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  const startKey = `${start[0]},${start[1]}`;
  const gScore = { [startKey]: 0 };
  const fScore = { [startKey]: heuristic(start, end) };
  const cameFrom = {};

  const openQueue = new TinyQueue(
    [{ pos: start, f: fScore[startKey] }],
    (a, b) => a.f - b.f
  );
  const closedSet = new Set();

  while (openQueue.length > 0) {
    const current = openQueue.pop();
    const [cx, cy] = current.pos;
    const currentKey = `${cx},${cy}`;

    if (cx === end[0] && cy === end[1]) {
      const path = [current.pos];
      while (cameFrom[`${path[0][0]},${path[0][1]}`]) {
        path.unshift(cameFrom[`${path[0][0]},${path[0][1]}`]);
      }
      return path;
    }

    closedSet.add(currentKey);

    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      const neighborKey = `${nx},${ny}`;

      if (
        ny < 0 ||
        ny >= grid.length ||
        nx < 0 ||
        nx >= grid[0].length ||
        grid[ny][nx] === 0 ||
        closedSet.has(neighborKey)
      ) {
        continue;
      }

      const moveCost = dx !== 0 && dy !== 0 ? 1.4 : 1;
      const tentativeG = gScore[currentKey] + moveCost;

      if (tentativeG < (gScore[neighborKey] || Infinity)) {
        cameFrom[neighborKey] = [cx, cy];
        gScore[neighborKey] = tentativeG;
        const estimatedF = tentativeG + heuristic([nx, ny], end);
        fScore[neighborKey] = estimatedF;
        openQueue.push({ pos: [nx, ny], f: estimatedF });
      }
    }
  }

  return [];
}
