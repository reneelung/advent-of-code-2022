point_map = %{ "A": 1, "X": 1, "B": 2, "Y": 2, "C": 3, "Z": 3 }
# win (6 points) if difference == 1 or -2
# tie (3 points) if differece == 0
# lose (0 points) if difference == -1 or 2

File.read!("input.txt")
|> String.split("\n")
|> Enum.map(fn round ->
    round
    |> String.split("\s")
    |> Enum.map(fn move -> point_map[String.to_atom(move)] end)
end)
|> Enum.map(fn round ->
  [elf, me] = round
  difference = me - elf
  case difference do
    difference when difference in [1, -2] ->
      6 + me
    difference when difference in [-1, 2] ->
      0 + me
    _ ->
      3 + me
  end
end)
|> Enum.reduce(fn score, total -> total + score end)
|> inspect()
|> IO.puts()
