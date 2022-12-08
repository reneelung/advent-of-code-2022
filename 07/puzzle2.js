const _ = require('lodash');
const util = require('util')

const INPUT_FILE = "input.txt"
const REQUIRED_SPACE = 30000000;
const TOTAL_SPACE = 70000000;
const fs = require('fs'),
    readline = require('readline');
const rd = readline.createInterface({
    input: fs.createReadStream(INPUT_FILE),
    console: false
});

let file_system = {};
let history = [];
let location_index;
let total_sum = 0;
let list_of_file_sizes = [];

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

function get_file_sizes(directory) {
  _.forOwn(directory, function(value, key) {
    if (_.isPlainObject(value)) {
      get_file_sizes(value)
    } else if (key == "total_size") {
      list_of_file_sizes.push(value)
    }
  })
}

function get_size_of_directory_for_deletion(file_sizes, free_space) {
  return _.min(_.filter(file_sizes, function(size) {
    return free_space + size >= REQUIRED_SPACE
  }))
}

function summarize(file_system) {
  calculate_file_size(file_system)
  console.log(util.inspect(file_system, false, null, true))
  let free_space = TOTAL_SPACE - file_system.root.total_size
  let size_of_directory_to_delete = file_system.root.total_size;
  get_file_sizes(file_system)
  size_of_directory_to_delete = get_size_of_directory_for_deletion(list_of_file_sizes, free_space)
  console.log("Total sum of sizes (less than 100K): ", total_sum)
  console.log("size_of_directory_to_delete: ", size_of_directory_to_delete)
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