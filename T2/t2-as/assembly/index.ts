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
  barriers: Point[]
): Point[] | null {
  const openSet: Node[] = [];
  const closedSet: Set<string> = new Set();
  const barriersSet: Set<string> = new Set();
  for (let i = 0; i < barriers.length; i += 1) {
    const b = barriers[i];
    barriersSet.add(`${b.x},${b.y}`);
  }
  const snakeSet: Set<string> = new Set();
  for (let i = 0; i < snake.length - 1; i += 1) {
    const s = snake[i];
    snakeSet.add(`${s.x},${s.y}`);
  }

  openSet.push(new Node(start, 0, manhattanDistance(start, goal)));

  while (openSet.length > 0) {
    // 按照 f 值排序，取最优节点
    openSet.sort((a, b) => <i32>Math.trunc(a.f) - <i32>Math.trunc(b.f));
    const current = openSet.shift()!;
    closedSet.add(current.position.toString());


    console.log(`${current.position}`);

    if (current.position.equals(goal)) {
      return reconstructPath(current);
    }

    const neighbors: Point[] = getNeighbors(current.position) as Point[];

    for (let i = 0; i < neighbors.length; i += 1) {
      let neighbor = neighbors[i];
      if (closedSet.has(neighbor.toString()) || barriersSet.has(neighbor.toString()) || snakeSet.has(neighbor.toString())) {
        continue;
      }

      const g = current.g + 1;
      const h = manhattanDistance(neighbor, goal);
      const node = new Node(neighbor, g, h, current);

      let existing: Node | null = null;

      // 手动查找一个与 neighbor 位置相同的 Node
      for (let i = 0; i < openSet.length; i += 1) {
        const node = openSet[i];
        if (node.position.equals(neighbor)) {
          existing = node;
          break; // 找到后立刻退出循环
        }
      }

      // 判断是否存在该节点，并且更新 openSet
      if (!existing) {
        openSet.push(node);  // 如果不存在该节点，或者找到的节点的 g 值更大，则将新节点加入 openSet
      } else if (g < existing.g) {
        existing.g = g;
      }

    }
  }

  return null; // 无法找到路径
}

function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(point: Point): Point[] {
  const x = point.x;
  const y = point.y;
  const neighbors = [
    new Point(x, y + 1), // 上
    new Point(x - 1, y), // 左
    new Point(x, y - 1), // 下
    new Point(x + 1, y)  // 右
  ];

  return neighbors.filter(p => p.x > 0 && p.x < 8 && p.y > 0 && p.y < 8);
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
  const path = aStar(snake[0], fruit, snake, barriers);
  if (!path || path.length < 2) {
    return -1; // 无法到达果子
  }

  // 获取下一个移动方向
  const nextStep = path[1];
  const head = snake[0];

  if (nextStep.x === head.x && nextStep.y === head.y + 1) return 0; // 上
  if (nextStep.x === head.x - 1 && nextStep.y === head.y) return 1; // 左
  if (nextStep.x === head.x && nextStep.y === head.y - 1) return 2; // 下
  if (nextStep.x === head.x + 1 && nextStep.y === head.y) return 3; // 右

  return -1; // 其他情况返回不可达
}
