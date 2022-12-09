INPUT_FILE = "input.txt"
const _ = require('lodash');
const util = require('util')
const fs = require('fs'),
    readline = require('readline');
const rd = readline.createInterface({
    input: fs.createReadStream(INPUT_FILE),
    console: false
});

let row_counter = 0;
let grid = [];
let visible_trees = [];
function build_column(col_num, grid) {
    let column = [];
    _.each(grid, function(row) {
        column.push(row[col_num]);
    });
    return column;
}
function is_visible_from_left(tree_coords, tree_height, row) {
    let visible_from_left = "left";
    [col_num, row_num] = tree_coords
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (col_num > 0) {  // If tree is not already at left edge
        left_elements = row.slice(0, col_num)
        // console.log(`Trees to the left: ${left_elements}`)
        _.each(left_elements, function(height) {
            if (height >= tree_height) {
                visible_from_left = false;
            }
        })
    } else {
        // console.log(`Tree at left edge.`)
    }
    return visible_from_left;
}
function is_visible_from_right(tree_coords, tree_height, row) {
    let visible_from_right = "right";
    [col_num, row_num] = tree_coords
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (col_num < row.length) { // If tree is not already at right edge
        right_elements = row.slice(col_num + 1);
        // console.log(`Trees to the right: ${right_elements}`)
        _.each(right_elements, function(height) {
            if (height >= tree_height) {
                visible_from_right = false;
            }
        })
    } else {
        // console.log(`Tree at right edge.`)
    }
    return visible_from_right;
}
function is_visible_from_bottom(tree_coords, tree_height, column) {
    let visible_from_bottom = "bottom";
    [col_num, row_num] = tree_coords
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (row_num < column.length) { // If tree is not already at bottom edge
        below_elements = column.slice(row_num + 1);
        // console.log(`Trees below: ${below_elements}`)
        _.each(below_elements, function(height) {
            if (height >= tree_height) {
                visible_from_bottom = false;
            }
        })
    } else {
        // console.log(`Tree at bottom edge.`)
    }
    return visible_from_bottom;
}
function is_visible_from_top(tree_coords, tree_height, column) {
    let visible_from_top = "top";
    [col_num, row_num] = tree_coords
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (row_num > 0) { // If tree is not already at top edge
        above_elements = column.slice(0, row_num)
        // console.log(`Trees above: ${above_elements}`)
        _.each(above_elements, function(height) {
            if (height >= tree_height) {
                visible_from_top = false;
            }
        })
    } else {
        // console.log(`Tree at top edge.`)
    }
    return visible_from_top;
}
function is_visible(tree_coords, tree_height, row, grid) {
    [col_num, row_num] = tree_coords;
    let column = build_column(col_num, grid)
    let visibility = [is_visible_from_top(tree_coords, tree_height, column), is_visible_from_bottom(tree_coords, tree_height, column), is_visible_from_left(tree_coords, tree_height, row), is_visible_from_right(tree_coords, tree_height, row)]
    // console.log("Tree visibility: ", visibility)
    // console.log("\n\n")
    return visibility;
}

function get_visible_trees_in_row(row_num, row, grid) {
    return row.map(function(tree_height, col_num) {
        let tree_coords = [col_num, row_num]
        let visibility = is_visible(tree_coords, tree_height, row, grid);
        [visible_from_top,visible_from_bottom,visible_from_left,visible_from_right] = visibility;
        if (visible_from_top || visible_from_bottom || visible_from_left || visible_from_right) {
            visible_trees.push(tree_coords);
        }
        return visibility
    });
}

rd.on('line', function(line) {
    let grid_row = line.split("")
    grid[row_counter] = grid_row;
    row_counter++;
});
rd.on('close', function() {
    _.each(grid, function(row, row_num) {
        // console.log("row_num: ", row_num)
        // console.log("row: ", row)
        get_visible_trees_in_row(row_num, row, grid);
    })
    console.log("Number of visible trees: ", visible_trees.length)
})