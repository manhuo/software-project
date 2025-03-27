// The entry file of your WebAssembly module.

class Point {
  constructor(public x: number, public y: number) { }

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }
}

class Node {
  constructor(
    public position: Point,
    public g: number,
    public h: number,
    public parent: Node | null = null
  ) { }

  get f(): number {
    return this.g + this.h;
  }
}

function aStar(
  start: Point,
  goal: Point,
  snake: Point[],
  barriers: Point[],
  width: number,
  height: number
): Point[] | null {
  // 修改1: 将 openSet 从数组改为 Map
  const openSet: Map<string, Node> = new Map();
  const closedSet: Set<string> = new Set();
  const barriersSet: Set<string> = new Set();
  barriers.forEach(b => barriersSet.add(`${b.x},${b.y}`));
  const snakeSet: Set<string> = new Set();
  snake.forEach(s => snakeSet.add(`${s.x},${s.y}`));

  // 修改2: 使用 Map 存储起始节点
  openSet.set(`${start.x},${start.y}`, new Node(start, 0, manhattanDistance(start, goal)));

  while (openSet.size > 0) {
    // 修改3: 获取 f 值最小的节点（这里使用了 Map 转 Array 排序）
    const current = Array.prototype.slice.call(openSet.values()).sort((a, b) => a.f - b.f)[0];
    openSet.delete(`${current.position.x},${current.position.y}`); // 删除已经处理过的节点
    closedSet.add(current.position.toString());

    if (current.position.equals(goal)) {
      return reconstructPath(current);
    }

    const neighbors: Point[] = getNeighbors(current.position, width, height) as Point[];

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (closedSet.has(neighbor.toString()) || barriersSet.has(neighbor.toString()) || snakeSet.has(neighbor.toString())) {
        continue;
      }

      const g = current.g + 1;
      const h = manhattanDistance(neighbor, goal);
      const node = new Node(neighbor, g, h, current);

      // 修改4: 使用 Map 中的 get 方法检查并更新节点
      const existing = openSet.get(`${neighbor.x},${neighbor.y}`);
      if (!existing || g < existing.g) {
        openSet.set(`${neighbor.x},${neighbor.y}`, node);
      }
    }
  }

  return null; // 无法找到路径
}

function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(point: Point, width: number, height: number): Point[] {
  const { x, y } = point;
  const neighbors = [
    new Point(x, y - 1), // 上
    new Point(x - 1, y), // 左
    new Point(x, y + 1), // 下
    new Point(x + 1, y)  // 右
  ];

  return neighbors.filter(p => p.x >= 0 && p.x < width && p.y >= 0 && p.y < height);
}

function reconstructPath(node: Node): Point[] {
  const path: Point[] = [];
  let current: Node | null = node;
  while (current) {
    path.unshift(current.position);
    current = current.parent;
  }
  return path;
}

// 主函数
export function greedy_snake_move_barriers(snakeArr: Int32Array, fruitArr: Int32Array, barriersArr: Int32Array): number {
  const width = 8;
  const height = 8;

  // 解析输入数据
  const snake: Point[] = [];
  for (let i = 0; i < snakeArr.length; i += 2) {
    snake.push(new Point(snakeArr[i], snakeArr[i + 1]));
  }
  const fruit = new Point(fruitArr[0], fruitArr[1]);
  const barriers: Point[] = [];
  for (let i = 0; i < barriersArr.length; i += 2) {
    barriers.push(new Point(barriersArr[i], barriersArr[i + 1]));
  }

  // 使用 A* 算法寻找路径
  const path = aStar(snake[0], fruit, snake, barriers, width, height);
  if (!path || path.length < 2) {
    return -1; // 无法到达果子
  }

  // 获取下一个移动方向
  const nextStep = path[1];
  const head = snake[0];

  if (nextStep.x === head.x && nextStep.y === head.y - 1) return 0; // 上
  if (nextStep.x === head.x - 1 && nextStep.y === head.y) return 1; // 左
  if (nextStep.x === head.x && nextStep.y === head.y + 1) return 2; // 下
  if (nextStep.x === head.x + 1 && nextStep.y === head.y) return 3; // 右

  return -1; // 其他情况返回不可达
}
