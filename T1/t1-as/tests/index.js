import assert from "assert";
import { greedy_snake_move } from "../build/debug.js";

function greedy_snake_fn_checker(snake, food) {
    let now_snake = new Int32Array([
        snake[0], snake[1], snake[2], snake[3], snake[4], snake[5], snake[6], snake[7]
    ]);
    let turn = 1;

    while (true) {
        let result = greedy_snake_move(now_snake, food);

        // **计算蛇的新位置**
        let new_snake = new Int32Array([
            now_snake[0] + (result == 3 ? 1 : 0) - (result == 1 ? 1 : 0),
            now_snake[1] + (result == 0 ? 1 : 0) - (result == 2 ? 1 : 0),
            now_snake[0], now_snake[1],
            now_snake[2], now_snake[3],
            now_snake[4], now_snake[5]
        ]);

        console.log(`x:${now_snake[0]} y:${now_snake[1]}`);
        // **检查是否撞墙**
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) {
            console.log("撞墙");
            return;
        }

        // **检查是否撞到自己**
        for (let i = 2; i < 8; i += 2) {
            if (new_snake[0] == new_snake[i] && new_snake[1] == new_snake[i + 1]) {
                console.log("撞到自己");
                return;
            }
        }

        // **检查是否吃到果子**
        if (new_snake[0] == food[0] && new_snake[1] == food[1]) {
            console.log("吃到果子ok" + turn);
            return;
        }

        // **更新蛇的状态**
        now_snake = new_snake;

        // **回合数超限**
        if (turn > 200) {
            console.log("太多回合");
            return;
        }

        turn += 1;
    }
}

// **测试用例**
const test_cases = [
    { snake: new Int32Array([4, 4, 4, 5, 4, 6, 4, 7]), fruit: new Int32Array([4, 3]) }, // 向下一步到位
    { snake: new Int32Array([3, 1, 3, 2, 2, 2, 2, 1]), fruit: new Int32Array([1, 1]) }, // 向左绕开自己
    { snake: new Int32Array([4, 4, 4, 3, 4, 2, 4, 1]), fruit: new Int32Array([1, 1]) }, // 顶点位置
    { snake: new Int32Array([5, 5, 5, 6, 5, 7, 5, 8]), fruit: new Int32Array([8, 8]) }, // 顶点位置
    { snake: new Int32Array([4, 4, 4, 3, 4, 2, 3, 2]), fruit: new Int32Array([1, 1]) }, // L型
    { snake: new Int32Array([5, 5, 5, 6, 5, 7, 6, 7]), fruit: new Int32Array([8, 8]) }, // L型
    { snake: new Int32Array([1, 1, 1, 2, 2, 2, 2, 1]), fruit: new Int32Array([4, 4]) }  // 向右绕开自己
];

// **运行所有测试**
for (let i = 0; i < test_cases.length; i++) {
    console.log(`运行测试用例 #${i + 1}`);
    greedy_snake_fn_checker(test_cases[i].snake, test_cases[i].fruit);
}

console.log("complete");
