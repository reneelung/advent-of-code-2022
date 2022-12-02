point_map = %{ "A": 1, "X": 0, "B": 2, "Y": 3, "C": 3, "Z": 6 }
# win (6 points) if difference == 1 or -2
# tie (3 points) if differece == 0
# lose (0 points) if difference == -1 or 2
# condition_map = %{ 0 => "lose", 3 => "tie", 6 => "win" }
File.read!("input.txt")
|> String.split("\n")
|> Enum.map(fn round ->
    round
    |> String.split("\s")
    |> Enum.map(fn move -> point_map[String.to_atom(move)] end)
end)
|> Enum.map(fn round ->
  [elf, points] = round
  me =
    case points do
      0 ->
        case elf do
          1 ->
            3
          _ ->
            elf - 1
        end
      3 ->
        elf
      6 ->
        case elf do
          3 ->
            1
          _ ->
            elf + 1
        end
    end
   me + points
  # [points, condition_map[points], "elf: #{elf}", "me: #{me}", "total: #{me + points}"]
end)
|> Enum.reduce(fn score, total -> total + score end)
|> inspect()
|> IO.puts()
