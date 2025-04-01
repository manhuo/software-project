// The entry file of your WebAssembly module.
class Food {
  x: i32;
  y: i32;
  dist: i32;

  constructor(x: i32, y: i32, dist: i32) {
    this.x = x;
    this.y = y;
    this.dist = dist;
  }

  equals(other: Food): boolean {
    return this.x === other.x && this.y === other.y;
  }

}

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
  width: number
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

  openSet.push(new Node(start, 0, manhattanDistance1(start, goal)));

  while (openSet.length > 0) {
    // 按照 f 值排序，取最优节点
    openSet.sort((a, b) => <i32>Math.trunc(a.f) - <i32>Math.trunc(b.f));
    const current = openSet.shift()!;
    closedSet.add(current.position.toString());


    // console.log(`${current.position}`);

    if (current.position.equals(goal)) {
      return reconstructPath(current);
    }

    const neighbors: Point[] = getNeighbors(current.position, width) as Point[];

    for (let i = 0; i < neighbors.length; i += 1) {
      let neighbor = neighbors[i];
      if (closedSet.has(neighbor.toString()) || barriersSet.has(neighbor.toString()) || snakeSet.has(neighbor.toString())) {
        continue;
      }

      const g = current.g + 1;
      const h = manhattanDistance1(neighbor, goal);
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

function manhattanDistance1(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(point: Point, width: number): Point[] {
  const x = point.x;
  const y = point.y;
  const neighbors = [
    new Point(x, y + 1), // 上
    new Point(x - 1, y), // 左
    new Point(x, y - 1), // 下
    new Point(x + 1, y)  // 右
  ];

  return neighbors.filter(p => p.x > 0 && p.x < width && p.y > 0 && p.y < width);
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


function greedy_snake_move_barriers(snakeArr: Int32Array, fruitArr: Int32Array, barriersArr: Int32Array, width: number): number {

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
  const path = aStar(snake[0], fruit, snake, barriers, width);
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


export function greedy_snake_step(
  n: i32,                      // 棋盘大小
  snake: Int32Array,           // 我方蛇的坐标
  snakeNum: i32,               // 其他蛇的数量
  otherSnakes: Int32Array,     // 其他蛇的坐标
  foodNum: i32,                // 场上果子的数量
  foods: Int32Array,           // 果子坐标
  round: i32                   // 剩余回合数
): number {
  const snakesDists: Food[][] = [];
  for (let i = 0; i < snakeNum; i += 1) {
    snakesDists[i] = [];
    for (let j = 0; j < foodNum; j += 1) {
      snakesDists[i][j] = new Food(foods[2 * j], foods[2 * j + 1],
        manhattanDistance(otherSnakes[8 * i], otherSnakes[8 * i + 1], foods[2 * j], foods[2 * j + 1]));

    }
    snakesDists[i].sort((a: Food, b: Food): i32 => a.dist - b.dist);
  }

  const mySnakeDists: Food[] = [];
  for (let j = 0; j < foodNum; j += 1) {
    mySnakeDists[j] = new Food(foods[2 * j], foods[2 * j + 1],
      manhattanDistance(snake[0], snake[1], foods[2 * j], foods[2 * j + 1])
    )
  }
  mySnakeDists.sort((a: Food, b: Food): i32 => a.dist - b.dist);

  let destFoodx = 0;
  let destFoody = 0;
  for (let i = 0; i < foodNum; i++) {
    for (let j = 0; j < snakeNum; j++) {
      if (mySnakeDists[i].dist <= snakesDists[j][0].dist +
        manhattanDistance(mySnakeDists[i].x, mySnakeDists[i].y, snakesDists[j][0].x, snakesDists[j][0].y)) {
        destFoodx = mySnakeDists[i].x;
        destFoody = mySnakeDists[i].y;
        break;
      }
    }
    if (destFoodx != 0) {
      break;
    }
  }

}

function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}