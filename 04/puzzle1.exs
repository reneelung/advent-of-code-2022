File.read!("input.txt")
|> String.split("\n")
|> Enum.map(fn pairs ->
  pairs
  |> String.split(",")
  |> Enum.map(fn range ->
    range
    |> String.split("-")
    |> Enum.map(&(String.to_integer(&1)))
  end)
  |> Enum.map(fn [range_start, range_end] ->
    Range.new(range_start, range_end)
    |> Enum.to_list()
    |> MapSet.new()
  end)
end)
|> Enum.filter(fn [set1, set2] ->
  MapSet.intersection(set1, set2) in [set1, set2]
end)
|> length()
|> inspect()
|> IO.puts()
