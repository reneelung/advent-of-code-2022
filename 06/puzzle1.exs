marker_length = 4
window_increment = 1

{_marker, number_of_previous_windows} = File.read!("input.txt")
|> String.split("", trim: true)
|> Enum.chunk_every(marker_length, window_increment, :discard)
|> Enum.with_index()
|> Enum.filter(fn {set, _index} ->
  Enum.uniq(set) == set
end)
|> Enum.at(0)

IO.puts(number_of_previous_windows + marker_length)
