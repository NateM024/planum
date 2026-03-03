import { supabase } from "./supabase";

export async function fetchPuzzles() {
  console.log("Fetching puzzles...");
  
  const { data, error } = await supabase
    .from("puzzles")
    .select(`
      id,
      fen,
      side_to_move,
      prompt,
      explanation,
      options,
      themes ( name, slug )
    `)
    .order("id");

  console.log("Data:", data);
  console.log("Error:", error);


  if (error) {
    console.error("Error fetching puzzles:", error);
    return [];
  }

  // Normalize the shape to match what the UI expects
  return data.map((puzzle) => ({
    ...puzzle,
    sideToMove: puzzle.side_to_move,
    theme: puzzle.themes?.slug,
  }));
}