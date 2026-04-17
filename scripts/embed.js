import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Concept sentences for each puzzle, keyed by puzzle id
const PUZZLE_CONCEPTS = {
  1: [
    "White should exchange on d5 to open the c-file for the rook",
    "After capturing on d5, the knight should be rerouted to the d4 outpost",
    "The d5 pawn becomes a long-term target after the exchange",
    "Central tension should be resolved by trading pawns rather than advancing",
  ],
  2: [
    "White should advance the b-pawn to the b5 square to initiate the minority attack",
    "The goal is to trade the b-pawn for Black's c-pawn to create a structural weakness",
    "Black will be left with a backward or isolated pawn on c6 or d5",
    "The queenside pawn majority should be used to create a permanent weakness",
  ],
  3: [
    "White should double rooks on the d-file to control the only open file",
    "The rook should be lifted to d3 to prepare doubling",
    "Controlling the only open file gives White a decisive positional advantage",
    "Black must either trade into a passive ending or cede the d-file entirely",
  ],
  4: [
    "The knight should be maneuvered to b3 to target the weak b7 pawn",
    "Black's bishop is bad because it is blocked by its own pawns on the same color",
    "The knight is superior to the bishop in this locked pawn structure",
    "White should exploit the good knight versus bad bishop imbalance",
  ],
  5: [
    "The king should move to b1 to step off the semi-open c-file",
    "White must prevent Black's counterplay on the c-file before attacking",
    "Moving the king to b1 eliminates tactical threats like Rxc3 or Nxe4",
    "The kingside attack with g4 and h4 is only safe after the king moves away from c1",
  ],
  6: [
    "White should launch a kingside attack with h4 before Black consolidates",
    "The isolated queen's pawn provides dynamic energy that must be used immediately",
    "White must attack while pieces are on the board before Black can trade them off",
    "Passive play allows Black to neutralize the position and exploit the weak d4 pawn in the endgame",
  ],
};

async function main() {
  console.log("Loading embedding model...");
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Model loaded.");

  for (const [puzzleId, concepts] of Object.entries(PUZZLE_CONCEPTS)) {
    console.log(`Computing embeddings for puzzle ${puzzleId}...`);

    // Embed each concept sentence
    const embeddings = [];
    for (const concept of concepts) {
      const output = await embedder(concept, { pooling: "mean", normalize: true });
      embeddings.push(Array.from(output.data));
    }

    // Store both the concept sentences and their embeddings
    const { error } = await supabase
      .from("puzzles")
      .update({
        concepts,
        concept_embeddings: embeddings,
      })
      .eq("id", parseInt(puzzleId));

    if (error) {
      console.error(`Error updating puzzle ${puzzleId}:`, error);
    } else {
      console.log(`Puzzle ${puzzleId} updated.`);
    }
  }

  console.log("All embeddings computed and stored.");
}

main();