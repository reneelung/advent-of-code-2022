INPUT_FILE = "input.txt"
const util = require('util')
const fs = require('fs'),
    readline = require('readline');
const rd = readline.createInterface({
    input: fs.createReadStream(INPUT_FILE),
    console: false
});

let tail_movement = 1;
let TAIL_COORDS = [0,0]
let HEAD_COORDS = [0,0];
function do_move(direction, coordinates) {
    [x, y] = coordinates
    let direction_map = {
        "R" : [x+1, y],
        "L" : [x-1, y],
        "U" : [x, y+1],
        "D" : [x, y-1]
    }
    return direction_map[direction];
}
function move_head(head_coordinates, direction, distance) {
    console.log(`Current head coordinates: ${HEAD_COORDS}`)
    HEAD_COORDS = do_move(direction, head_coordinates)
    move_tail(HEAD_COORDS, TAIL_COORDS, direction)
    console.log(`Updated head coordinates: ${HEAD_COORDS}`)
    distance--;
    if (distance > 0) {
        move_head(HEAD_COORDS, direction, distance)
    }
}
function move_tail(head_coords, tail_coords, direction) {
    [head_x, head_y] = head_coords;
    let tail_x = TAIL_COORDS[0];
    let tail_y = TAIL_COORDS[1];
    if (Math.abs(head_x - tail_x) > 1 || Math.abs(head_y - tail_y) > 1) {
        if(head_x != tail_x && head_y != tail_y) { // Diagonal movement
            if (direction == "R" || direction == "L") {
                tail_y = head_y;
            } else
            if (direction == "U" || direction == "D") {
                tail_x = head_x
            }
            console.log(`Moving tail diagonally from: ${TAIL_COORDS}`)
        }
        console.log(`Moving tail from: ${TAIL_COORDS}`)
        TAIL_COORDS = do_move(direction, [tail_x, tail_y])
        console.log(`...to ${TAIL_COORDS}`)
        tail_movement++;
    }
}

rd.on('line', function(line) {
    console.log("\n\n");
    [direction, distance] = line.split(" ")
    console.log(`Direction: ${direction}, distance: ${distance}`)
    move_head(HEAD_COORDS, direction, parseInt(distance));
    console.log("Head coordinates: ", HEAD_COORDS)
    console.log("Tail coordinates: ", TAIL_COORDS)
    console.log("Tail movements", tail_movement)
})