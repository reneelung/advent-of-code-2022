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
let scores_grid = [];

// Transpose a column into a list of numbers
function build_column(col_num, grid) {
    let column = [];
    _.each(grid, function(row) {
        column.push(row[col_num]);
    });
    return column;
}
function calculate(number_of_trees_seen, comparison_trees) {
    // Do some weird shit here because findIndex returns -1 if element is not present?!
    if (number_of_trees_seen == -1) {
        scenic_score = comparison_trees.length
    } else {
        scenic_score = comparison_trees.slice(0, number_of_trees_seen).length + 1
    }
    return scenic_score;
}
function calculate_left_scenic_score(tree_coords, tree_height, row) {
    [col_num, row_num] = tree_coords
    let left_scenic_score = 0;
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (col_num > 0) {  // If tree is not already at left edge
        left_elements = row.slice(0, col_num)
        // console.log(`Trees to the left: ${left_elements}`)
        // Scan left
        let number_of_trees_seen = left_elements.reverse().findIndex((current_tree) => current_tree >= tree_height)
        // console.log("number of trees seen to the left: ", number_of_trees_seen)
        left_scenic_score = calculate(number_of_trees_seen, left_elements)
        // console.log("Left scenic score: ", left_scenic_score);
    }
    return left_scenic_score;
}
function calculate_right_scenic_score(tree_coords, tree_height, row) {
    [col_num, row_num] = tree_coords
    let right_scenic_score = 0;
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (col_num < row.length) { // If tree is not already at right edge
        right_elements = row.slice(col_num + 1);
        // console.log(`Trees to the right: ${right_elements}`)
        let number_of_trees_seen = right_elements.findIndex((current_tree) => current_tree >= tree_height)
        right_scenic_score = calculate(number_of_trees_seen, right_elements)
        // console.log("Right scenic score: ", right_scenic_score);
    }
    return right_scenic_score;
}
function calculate_bottom_scenic_score(tree_coords, tree_height, column) {
    [col_num, row_num] = tree_coords
    let below_scenic_score = 0;
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (row_num < column.length) { // If tree is not already at bottom edge
        below_elements = column.slice(row_num + 1);
        // console.log(`Trees below: ${below_elements}`)
        let number_of_trees_seen = below_elements.findIndex((current_tree) => current_tree >= tree_height)
        below_scenic_score = calculate(number_of_trees_seen, below_elements)
        // console.log("Below scenic score: ", below_scenic_score);
    }
    return below_scenic_score;
}
function calculate_top_scenic_score(tree_coords, tree_height, column) {
    [col_num, row_num] = tree_coords
    let above_scenic_score = 0
    // console.log(`Comparing tree at ${tree_coords} with height ${tree_height}`)
    if (row_num > 0) { // If tree is not already at top edge
        above_elements = column.slice(0, row_num)
        // console.log(`Trees above: ${above_elements}`)
        let number_of_trees_seen = above_elements.reverse().findIndex((current_tree) => current_tree >= tree_height)
        above_scenic_score = calculate(number_of_trees_seen, above_elements)
        // console.log("Above scenic score: ", above_scenic_score);
    }
    return above_scenic_score;
}
function score_tree(tree_coords, tree_height, row, grid) {
    [col_num, row_num] = tree_coords;
    let column = build_column(col_num, grid)
    let scores = [calculate_top_scenic_score(tree_coords, tree_height, column), calculate_bottom_scenic_score(tree_coords, tree_height, column), calculate_left_scenic_score(tree_coords, tree_height, row), calculate_right_scenic_score(tree_coords, tree_height, row)]
    return scores;
}
function score_row(row_num, row, grid) {
    return row.map(function(tree_height, col_num) {
        let tree_coords = [col_num, row_num]
        let tree_scores = score_tree(tree_coords, tree_height, row, grid);
        [top_score, bottom_score, left_score, right_score] = tree_scores;
        let total_score = top_score*bottom_score*left_score*right_score;
        return total_score
    });
}

// Build Grid
rd.on('line', function(line) {
    let grid_row = line.split("")
    grid[row_counter] = grid_row;
    row_counter++;
});

// Score rows
rd.on('close', function() {
    _.each(grid, function(row, row_num) {
        scores_grid.push(score_row(row_num, row, grid));
    })
    console.log("Top scenic score: ", _.max(_.flatten(scores_grid)))
})