// The entry file of your WebAssembly module.

export function greedySnakeStep(
  n: i32,                      // 棋盘大小
  snake: Int32Array,           // 我方蛇的坐标
  snakeNum: i32,               // 其他蛇的数量
  otherSnakes: Int32Array,     // 其他蛇的坐标
  foodNum: i32,                // 场上果子的数量
  foods: Int32Array,           // 果子坐标
  round: i32                   // 剩余回合数
): number {
  const snakesMin: i32[] = [];
  for (let i = 0; i < snakeNum; i += 1) {
    let x = 0;
    let y = 0;
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let j = 0; j < foodNum; j += 1) {
      const dist = manhattanDistance(otherSnakes[8 * i], otherSnakes[8 * i + 1], foods[2 * j], foods[2 * j + 1]);
      if (dist < minDist) {
        minDist = dist;
        x = foods[2 * j];
        y = foods[2 * j + 1];
      }
    }
    snakesMin[2 * i] = x;
    snakesMin[2 * i + 1] = y;
  }
}

function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}