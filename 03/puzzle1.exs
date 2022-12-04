point_map = (for n <- ?a..?z, do: << n :: utf8 >>) ++ (for n <- ?A..?Z, do: << n :: utf8 >>) |> Enum.with_index()
File.read!("input.txt")
|> String.split("\n")
|> Enum.map(fn rucksack ->
  rucksack
  |> String.split_at(Integer.floor_div(String.length(rucksack), 2))
end)
|> Enum.map(fn {left, right} ->
  [left, right]
  |> Enum.map(&(String.split(&1, "", trim: true)))
  |> Enum.map(&(MapSet.new(&1)))
end)
|> Enum.map(fn [left, right] -> MapSet.intersection(left, right) end)
|> Enum.map(&(MapSet.to_list(&1)))
|> Enum.map(&(List.first(&1)))
|> Enum.map(fn item -> point_map |> Enum.find(fn {char, _index} -> char == item end) |> elem(1) end)
|> Enum.map(&(&1 + 1))
|> Enum.reduce(fn point, sum -> point + sum end)
|> inspect()
|> IO.puts()
