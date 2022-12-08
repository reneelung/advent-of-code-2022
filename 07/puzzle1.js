const _ = require('lodash');
const util = require('util')

INPUT_FILE = "test_input.txt"

const fs = require('fs'),
    readline = require('readline');
const rd = readline.createInterface({
    input: fs.createReadStream(INPUT_FILE),
    console: false
});

var file_system = {};
var history = [];
var location_index, current_directory, current_path;
var total_sum = 0;

function get_parent_path(history) {
  return history.join('.')
}
function is_file(parsed_line) {
  return !isNaN(parseInt(parsed_line[0]));
}
function calculate_file_size(directory) {
  let size = 0;
  _.forOwn(directory, function(value, key) {
    if (!_.isPlainObject(value)) {
      size += value;
    } else {
      let nested_size = calculate_file_size(value)
      size +=  nested_size;
    }
    directory.total_size = size
  })
  if (size <= 100000) {
    total_sum += size;
  }
  return size;
}

function summarize(file_system) {
  calculate_file_size(file_system)
  console.log(util.inspect(file_system, false, null, true))
  console.log("Total sum of sizes: ", total_sum)
}

rd.on('line', function(line) {
  // console.log("line: ", line)
  if (line == "$ cd /") {
    history.push('root')
    file_system.root = {}
    location_index = 0;
    current_path = file_system['root']
  } else {
    parsed_line = line.split(" ")
    current_directory = history[location_index]
    // console.log(`current directory: ${current_directory}`)
    if (parsed_line[1] == "cd") {
      if (parsed_line[2] == "..") {
        history.pop()
        location_index--;
      } else {
        current_location = history[location_index]
        history.push(parsed_line[2])
        location_index++;
      }
    } else
    if (parsed_line[0] == "dir") {
      let child_dir_name = parsed_line[1]
      let parent_path = get_parent_path(history.slice())
      let parent_obj = _.get(file_system, parent_path)
      if (parent_obj && !parent_obj.hasOwnProperty(child_dir_name)) {
        parent_obj[child_dir_name] = {}
      }
    }
    if (is_file(parsed_line)) {
      let child_dir_name = parsed_line[1]
      let parent_path = get_parent_path(history.slice())
      let parent_obj = _.get(file_system, parent_path)
      if (parent_obj && !parent_obj.hasOwnProperty(child_dir_name)) {
        parent_obj[parsed_line[1]] = parseInt(parsed_line[0])
      }
    }

  }
});
rd.on('close', function() {
    summarize(file_system)
})