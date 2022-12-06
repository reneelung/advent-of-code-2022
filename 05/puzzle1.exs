defmodule Stack do

  defstruct elements: []

  def new, do: %Stack{}

  def push(stack, element) do
   %Stack{elements: [stack.elements | element] |> List.flatten()}
  end

  def pop(%Stack{elements: []}), do: raise("Stack is empty!")
  def pop(%Stack{elements: [element]}) do
    {[element], %Stack{elements: []}}
  end
  def pop(stack) do
    el = Enum.slice(stack.elements, -1, 1)
    rest = Enum.slice(stack.elements, 0, Stack.depth(stack) - 1)
    {el, %Stack{elements: rest}}
  end

  def depth(%Stack{elements: elements}), do: length(elements)

end

defmodule Visualizer do
  def get_max_stack_height(stacks) do
    stacks
    |> Enum.map(&(Stack.depth(&1)))
    |> Enum.max()
  end

  def pad_stack(stack, max) do
    case Stack.depth(stack) do
      depth when depth < max ->
        Stack.push(stack, ([" "]))
        |> Visualizer.pad_stack(max)
      _ ->
        stack
    end
  end

  def print_row(stacks, row_num) do
    row = stacks
    |> Enum.map(fn stack ->
      stack.elements
      |> Enum.reverse()
      |> Enum.at(row_num)
    end)
    |> Enum.map(fn val -> "[#{val}]" end)
    |> Enum.join(" ")
    IO.puts(row)
  end

  def visualize(stacks) do
    stack_height = Visualizer.get_max_stack_height(stacks)
    padded_stacks = stacks |> Enum.map(&(Visualizer.pad_stack(&1, stack_height)))
    0..(stack_height - 1)
    |> Enum.each(&(Visualizer.print_row(padded_stacks, &1)))
    IO.puts("==========")
    IO.puts("\n")
    IEx.pry()
  end
end

defmodule Cargo do
  # Test Input
  # stack1 = struct(Stack, %{elements: ["Z","N"]})
  # stack2 = struct(Stack, %{elements: ["M", "C", "D"]})
  # stack3 = struct(Stack, %{elements: ["P"]})
  # defstruct stacks: [stack1, stack2, stack3]

  stack1 = struct(Stack, %{elements: ["C", "Z", "N", "B", "M", "W", "Q", "V"]})
  stack2 = struct(Stack, %{elements: ["H", "Z", "R", "W", "C", "B"]})
  stack3 = struct(Stack, %{elements: ["F", "Q", "R", "J"]})
  stack4 = struct(Stack, %{elements: ["Z", "S", "W", "H", "F", "N", "M", "T"]})
  stack5 = struct(Stack, %{elements: ["G", "F", "W", "L", "N", "Q", "P"]})
  stack6 = struct(Stack, %{elements: ["L", "P", "W"]})
  stack7 = struct(Stack, %{elements: ["V", "B", "D", "R", "G", "C", "Q", "J"]})
  stack8 = struct(Stack, %{elements: ["Z", "Q", "N", "B", "W"]})
  stack9 = struct(Stack, %{elements: ["H", "L", "F", "C", "G", "T", "J"]})

  defstruct stacks: [stack1, stack2, stack3, stack4, stack5, stack6, stack7, stack8, stack9]

  def new do
    %Cargo{}
  end

  def update_stacks(_cargo, stacks) do
    %Cargo{
      stacks: stacks
    }
  end

  def move_box(origin, target, quantity) do
    {box, origin} = Stack.pop(origin)
    # IO.puts("{box, origin}: #{inspect(box)}, #{inspect(origin)}")
    target = Stack.push(target, box)
    new_quantity = quantity - 1
    case new_quantity do
      0 ->
        {origin, target}
      _ ->
        Cargo.move_box(origin, target, quantity - 1)
    end
  end

  def move_cargo(cargo, []) do
    cargo.stacks
    |> Enum.with_index()
    |> Enum.each(fn {stack, index} ->
      # IO.puts("Stack #{index + 1}: #{List.last(stack.elements)}")
    end)
  end
  def move_cargo(cargo, moves) do
      [ current_move | later_moves] = moves
      [mv, qty, fr, org, to, tar] = current_move

      IO.puts("#{mv} #{qty} #{fr} #{org} #{to} #{tar}")
      # IO.puts("current state: #{inspect(cargo.stacks)}")
      quantity = String.to_integer(qty)
      # IO.puts("quantity: #{inspect(quantity)}")
      origin = String.to_integer(org)
      target = String.to_integer(tar)

      origin_stack = Enum.at(cargo.stacks, origin - 1)
      # IO.puts("origin stack: #{inspect(origin_stack)}")
      target_stack = Enum.at(cargo.stacks, target - 1)
      # IO.puts("target stack: #{inspect(target_stack)}")

      current_stacks = cargo.stacks

      {updated_origin, updated_target} = Cargo.move_box(origin_stack, target_stack, quantity)
      # IO.puts("updated origin stack: #{inspect(updated_origin)}")
      # IO.puts("updated target stack: #{inspect(updated_target)}")

      updated_stacks = current_stacks
      |> List.replace_at(target - 1, updated_target)
      |> List.replace_at(origin - 1, updated_origin)
      # IO.puts("updated_stacks: #{inspect(updated_stacks)}")

      Visualizer.visualize(updated_stacks)

      cargo.stacks
      |> Cargo.update_stacks(updated_stacks)
      |> Cargo.move_cargo(later_moves)
  end
end

cargo = Cargo.new()

moves = File.read!("input.txt")
  |> String.split("\n")
  |> Enum.map(fn move ->
    move
    |> String.split("\s")
  end)

Cargo.move_cargo(cargo, moves)
