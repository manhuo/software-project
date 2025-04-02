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
      let neighbor: Point = neighbors[i];
      // console.log(`astar:${neighbor.x},${neighbor.y}`);
      // console.log(`${barriersSet.has(neighbor.toString())}`);
      // console.log(`${snakeSet.has(neighbor.toString())}`);
      if (closedSet.has(neighbor.toString()) || barriersSet.has(neighbor.toString()) || snakeSet.has(neighbor.toString())
      ) {
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

  let result: Point[] = [];
  for (let i = 0; i < neighbors.length; i++) {
    let p = neighbors[i];
    if (p.x > 0 && p.x <= width && p.y > 0 && p.y <= width) {
      result.push(p);
    }
  }
  return result;

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


function greedy_snake_move_barriers(snakeArr: Int32Array, fruitArr: Int32Array, barriersArr: Int32Array, width: number): i32 {

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
): i32 {
  const snakesDists: Food[] = [];
  for (let i = 0; i < snakeNum; i += 1) {
    let x = 0;
    let y = 0;
    let dist: i32 = 1000;
    for (let j = 0; j < foodNum; j += 1) {
      if (dist < manhattanDistance(otherSnakes[8 * i], otherSnakes[8 * i + 1], foods[2 * j], foods[2 * j + 1])) {
        x = foods[2 * j];
        y = foods[2 * j + 1];
        dist = manhattanDistance(otherSnakes[8 * i], otherSnakes[8 * i + 1], foods[2 * j], foods[2 * j + 1]);
      }
    }
    snakesDists.push(new Food(x, y, dist));
  }

  const mySnakeDists: Food[] = [];
  for (let j = 0; j < foodNum; j += 1) {
    mySnakeDists[j] = new Food(foods[2 * j], foods[2 * j + 1],
      manhattanDistance(snake[0], snake[1], foods[2 * j], foods[2 * j + 1])
    )
  }
  mySnakeDists.sort((a: Food, b: Food): i32 => a.dist - b.dist);

  if (mySnakeDists[0].dist >= round) {
    const direct1: i32 = defensiveMove(n, snake, snakeNum, otherSnakes);
    console.log(`${snake[0]},${snake[1]}:direct1,${direct1}`);
    return direct1;
  }


  let destFoodx = 0;
  let destFoody = 0;
  for (let i = 0; i < foodNum / 2; i++) {
    if (inCorner(mySnakeDists[i].x, mySnakeDists[i].y, n))
      continue;
    for (let j = 0; j < snakeNum; j++) {
      if (mySnakeDists[i].dist < snakesDists[j].dist +
        manhattanDistance(mySnakeDists[i].x, mySnakeDists[i].y, snakesDists[j].x, snakesDists[j].y)) {
        destFoodx = mySnakeDists[i].x;
        destFoody = mySnakeDists[i].y;
        break;
      }
    }
    if (destFoodx != 0) {
      break;
    }
  }

  if (snakeNum == 0) {
    destFoodx = mySnakeDists[0].x;
    destFoody = mySnakeDists[0].y;
  }


  // console.log(`${snakeNum},${destFoodx},${destFoody}`);

  if (destFoodx == 0) {
    return defensiveMove(n, snake, snakeNum, otherSnakes);
  } else {
    const barriersArr1: i32[] = [];
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        if (isFurtherCollision(i, j, n, snake, snakeNum, otherSnakes)) {
          barriersArr1.push(i);
          barriersArr1.push(j);
        }
      }
    }
    const barriersArr: Int32Array = new Int32Array(barriersArr1.length);
    for (let i = 0; i < barriersArr1.length; i++) {
      barriersArr[i] = barriersArr1[i];
    }
    const fruitArr: Int32Array = new Int32Array(2);
    fruitArr[0] = destFoodx;
    fruitArr[1] = destFoody;
    let direct: i32 = greedy_snake_move_barriers(snake, fruitArr, barriersArr, n);

    if (direct == -1) {
      const direct1: i32 = defensiveMove(n, snake, snakeNum, otherSnakes);
      console.log(`${snake[0]},${snake[1]}:direct1,${direct1}`);
      return direct1;
    }
    else {
      console.log(`${snake[0]},${snake[1]}:direct,${direct}`);
      return direct;
    }
  }
}

function defensiveMove(
  n: i32,
  snake: Int32Array,
  snakeNum: i32,
  otherSnakes: Int32Array
): i32 {
  const headx = snake[0];
  const heady = snake[1];

  const body1x = snake[2];
  const body1y = snake[3];
  const body2x = snake[4];
  const body2y = snake[5];

  const tailx = snake[6];
  const taily = snake[7];

  const xCoords = [headx, body1x, body2x, tailx];
  const yCoords = [heady, body1y, body2y, taily];

  let uniquex = new Set<i32>();
  let uniquey = new Set<i32>();
  for (let i = 0; i < xCoords.length; i++) {
    uniquex.add(xCoords[i]);
    uniquey.add(yCoords[i]);
  }


  if (uniquex.size == 2 && uniquey.size == 2 && Math.abs(headx - tailx) + Math.abs(heady - taily) == 1) {   //正方形
    const xdirection = (<i32>(tailx - headx == 0 ? 0 : tailx - headx / Math.abs(tailx - headx)));
    const ydirection = (<i32>(taily - heady == 0 ? 0 : taily - heady / Math.abs(taily - heady)));
    console.log(`defensive:${xdirection},${ydirection}`)
    if (xdirection != 0) {
      if (xdirection > 0)
        return 3;
      else
        return 1;
    }
    if (ydirection > 0)
      return 0;
    else
      return 2;
  } else if (uniquex.size >= 2 && uniquey.size >= 2) {   //L型或z型
    const xdirection = (<i32>(tailx - headx == 0 ? 0 : tailx - headx / Math.abs(tailx - headx)));
    const ydirection = (<i32>(taily - heady == 0 ? 0 : taily - heady / Math.abs(taily - heady)));
    if (!isFurtherCollision(headx + xdirection, heady, n, snake, snakeNum, otherSnakes)) {
      if (xdirection > 0)
        return 3;
      else
        return 1;
    }
    if (!isFurtherCollision(headx, heady + ydirection, n, snake, snakeNum, otherSnakes)) {
      if (ydirection > 0)
        return 0;
      else
        return 2;
    }
    if (Math.abs(body2y - heady) == 2 || Math.abs(tailx - headx) == 2 ||
      isFurtherCollision(headx, heady - ydirection, n, snake, snakeNum, otherSnakes)) {
      if (!isFurtherCollision(headx - xdirection, heady, n, snake, snakeNum, otherSnakes)) {
        if (-xdirection > 0)
          return 3;
        else
          return 1;
      }
    }
    if (-ydirection > 0)  //可能死
      return 0;
    else
      return 2;
  } else {   //一字型
    if (Math.abs(headx - body1x) != 0) {
      if (!isFurtherCollision(headx, heady + 1, n, snake, snakeNum, otherSnakes)) {
        return 0;
      }
      if (!isFurtherCollision(headx, heady - 1, n, snake, snakeNum, otherSnakes)) {
        return 2;
      }
      return 2 + headx - body1x;   //可能死
    } else {
      if (!isFurtherCollision(headx + 1, heady, n, snake, snakeNum, otherSnakes)) {
        return 3;
      }
      if (!isFurtherCollision(headx - 1, heady, n, snake, snakeNum, otherSnakes)) {
        return 1;
      }
      return 1 - (heady - body1y);   //可能死
    }
  }
}

function isCollision(x: i32, y: i32, n: i32, snake: Int32Array, snakeNum: i32, otherSnakes: Int32Array, ignoreSelf: boolean = false): boolean {
  if (x < 1 || x > n || y < 1 || y > n) return true; // 撞墙

  if (!ignoreSelf) {
    for (let i = 0; i < 6; i += 2) {
      if (snake[i] === x && snake[i + 1] === y) return true; // 撞到自己
    }
  }

  for (let j = 0; j < snakeNum; j++) {
    for (let i = 0; i < 6; i += 2) {
      if (otherSnakes[j * 8 + i] === x && otherSnakes[j * 8 + i + 1] === y) return true; // 撞到其他蛇
    }
  }
  return false;
}

function isFurtherCollision(x: i32, y: i32, n: i32, snake: Int32Array, snakeNum: i32, otherSnakes: Int32Array): boolean {
  if (isCollision(x, y, n, snake, snakeNum, otherSnakes)) return true;
  let total: i32 = 0;
  if (isCollision(x - 1, y, n, snake, snakeNum, otherSnakes, true)) total++;
  if (isCollision(x + 1, y, n, snake, snakeNum, otherSnakes, true)) total++;
  if (isCollision(x, y - 1, n, snake, snakeNum, otherSnakes, true)) total++;
  if (isCollision(x, y + 1, n, snake, snakeNum, otherSnakes, true)) total++;
  if (total >= 3) {
    return true;
  }
  return false;
}

function inCorner(x: i32, y: i32, n: i32): boolean {
  let n1: i32 = <i32>n / 4;
  n1 -= 1;
  if ((Math.abs(x - 1) <= n1 && Math.abs(y - 1) <= n1)
    || (Math.abs(x - 1) <= n1 && Math.abs(y - n) <= n1)
    || (Math.abs(x - n) <= n1 && Math.abs(y - 1) <= n1)
    || (Math.abs(x - n) <= n1 && Math.abs(y - n) <= n1)) {
    return true;
  } else {
    return false;
  }
}

function manhattanDistance(x1: i32, y1: i32, x2: i32, y2: i32): i32 {
  return (<i32>Math.abs(x1 - x2)) + (<i32>Math.abs(y1 - y2));
}