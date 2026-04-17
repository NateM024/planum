import { supabase } from "./supabase";
 
export async function fetchPuzzles() {
  const { data, error } = await supabase
    .from("puzzles")
    .select(`
      id,
      fen,
      side_to_move,
      prompt,
      explanation,
      options,
      concepts,
      concept_embeddings,
      themes ( name, slug )
    `)
    .order("id");
 
  if (error) {
    console.error("Error fetching puzzles:", error);
    return [];
  }
 
  return data.map((puzzle) => ({
    ...puzzle,
    sideToMove: puzzle.side_to_move,
    theme: puzzle.themes?.slug,
  }));
}
 