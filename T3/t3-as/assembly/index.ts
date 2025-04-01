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

}



export function greedySnakeStep(
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
}

function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}