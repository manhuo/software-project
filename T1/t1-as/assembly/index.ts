// The entry file of your WebAssembly module.


export function greedy_snake_move(snake: Int32Array, fruit: Int32Array): i32 {
  const dx: i32[] = [0, -1, 0, 1]; // x 方向偏移量
  const dy: i32[] = [1, 0, -1, 0]; // y 方向偏移量

  const headX: i32 = snake[0];
  const headY: i32 = snake[1];
  const fruitX: i32 = fruit[0];
  const fruitY: i32 = fruit[1];

  function is_safe(x: i32, y: i32, snake: Int32Array): bool {
    if (x < 1 || x > 8 || y < 1 || y > 8) return false; // 碰墙
    for (let i = 0; i < 6; i += 2) {
      if (snake[i] == x && snake[i + 1] == y) return false; // 撞自己
    }
    return true;
  }

  let bestMove: i32 = -1;
  let minDist: i32 = 100;

  for (let i = 0; i < 4; i++) {
    let newX: i32 = headX + dx[i];
    let newY: i32 = headY + dy[i];
    if (is_safe(newX, newY, snake)) {
      let dist: i32 = abs(newX - fruitX) + abs(newY - fruitY);
      if (dist < minDist) {
        minDist = dist;
        bestMove = i;
      }
    }
  }

  return bestMove == -1 ? 0 : bestMove; // 如果无安全路径，默认向上
}

// 计算绝对值函数
function abs(value: i32): i32 {
  return value < 0 ? -value : value;
}
