point_map = (for n <- ?a..?z, do: << n :: utf8 >>) ++ (for n <- ?A..?Z, do: << n :: utf8 >>) |> Enum.with_index()
File.read!("input.txt")
|> String.split("\n")
|> Enum.chunk_every(3)
|> Enum.map(fn group ->
    Enum.map(group, fn pack ->
      pack
      |> String.split("", trim: true)
      |> MapSet.new()
    end)
  end)
|> Enum.map(fn [pack1, pack2, pack3] ->
  pack1
  |> MapSet.intersection(pack2)
  |> MapSet.intersection(pack3)
  |> MapSet.to_list()
  |> List.first()
end)
|> Enum.map(fn item -> point_map |> Enum.find(fn {char, _index} -> char == item end) |> elem(1) end)
|> Enum.map(&(&1 + 1))
|> Enum.reduce(fn point, sum -> point + sum end)
|> inspect()
|> IO.puts()
