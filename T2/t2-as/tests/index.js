import assert from "assert";
import { greedy_snake_move_barriers } from "../build/debug.js";
function greedy_snake_barriers_checker(initial_snake, food_num, foods, barriers, access) {
    if (initial_snake.length !== 8) throw "Invalid snake length";
    
    let current_snake = [...initial_snake];
    let current_foods = [...foods];
    const barriers_list = [];
    for (let i = 0; i < barriers.length; i += 2) {
        const x = barriers[i];
        const y = barriers[i + 1];
        if (x !== -1 && y !== -1) {
            barriers_list.push({ x, y });
        }
    }
    let turn = 1;

    while (turn <= 200) {
        const direction = greedy_snake_move_barriers(current_snake, current_foods, barriers);

        if (access === 0) {
            if (direction !== -1) {
                return -5;
            } else {
                return 1;
            }
        }

        // invalid direction
        if (direction < 0 || direction > 3) return -4; 

        let new_snake = [
            current_snake[0] + (direction == 3) - (direction == 1),
            current_snake[1] + (direction == 0) - (direction == 2),
            current_snake[0],
            current_snake[1],
            current_snake[2],
            current_snake[3],
            current_snake[4],
            current_snake[5],
        ];


        // out of range
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) return -1;

        // hit a barrier
        if (barriers_list.some(ob => ob.x === new_snake[0] && ob.y === new_snake[1])) return -2;

        // eat food
        let ate_index = -1;
        for (let i = 0; i < current_foods.length; i += 2) {
            if (new_snake[0] === current_foods[i] && new_snake[1] === current_foods[i + 1]) {
                ate_index = i;
                break;
            }
        }
        
        console.log("turn " + turn + " :" + direction);
        if (ate_index !== -1) {
            current_foods.splice(ate_index, 2);
            food_num -= 1;
        }

        if (food_num === 0) {
            console.log("Total turn: " + turn);
            return turn; 
        }
        
        current_snake = new_snake;
        turn++;
    }
    
    // timeout
    return -3; 
}

assert.strictEqual(
    greedy_snake_barriers_checker(
        [1,4,1,3,1,2,2,2], 
        1,                  
        [1,5],                              
        [8,1,8,2,8,3,8,4,8,5,8,6,8,7,8,8,7,6,6,6,7,1,7,2],
        1            
    ),
    1
);
