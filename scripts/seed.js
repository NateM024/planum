import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY

);

// First insert your themes
const themes = [
  { name: "Central Control",        slug: "central-control" },
  { name: "Structural Weaknesses",  slug: "structural-weaknesses" },
  { name: "Open Files",             slug: "open-files" },
  { name: "Piece Quality",          slug: "piece-quality" },
  { name: "Prophylaxis",            slug: "prophylaxis" },
  { name: "Dynamic vs. Static",     slug: "dynamic-vs-static" },
];

const { data: insertedThemes, error: themeError } = await supabase
  .from("themes")
  .upsert(themes, { onConflict: "slug" })
  .select();


if (themeError) {
  console.error("Error inserting themes:", themeError);
  process.exit(1);
}

console.log("Themes inserted:", insertedThemes);

// Build a lookup so we can reference theme IDs by slug
const themeMap = {};
for (const theme of insertedThemes) {
  themeMap[theme.slug] = theme.id;
}

// Then insert your puzzles
const puzzles = [
  {
    fen: "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
    side_to_move: "white",
    theme_id: themeMap["central-control"],
    prompt: "White has a spatial edge in the center. What is the most constructive long-term plan?",
    explanation: "After cxd5 exd5, White opens the c-file for the rook and can route the knight to d4 — the ideal central outpost. The d5-pawn becomes a long-term target. Rushing c5 surrenders the tension too early, and a kingside storm lacks foundation when the center is unresolved.",
    options: [
      { id: "a", text: "Expand with c5, fixing Black's d5-pawn and gaining queenside space", correct: false, wrongReason: "Playing c5 surrenders the central tension too early. Black responds with ...b6 and the c5-pawn becomes a target rather than an asset. White's edge comes from keeping the tension, not releasing it." },
      { id: "b", text: "Play cxd5, opening the c-file and recentralizing the knight to d4", correct: true },
      { id: "c", text: "Launch a kingside pawn advance with h4–h5", correct: false, wrongReason: "A kingside pawn storm requires a stable center first. With the central tension still unresolved, Black can counterattack in the middle with ...dxc4 or ...c5, leaving White's pawns overextended and the king exposed." },
      { id: "d", text: "Double rooks on the d-file before committing to a plan", correct: false, wrongReason: "Doubling rooks is a useful maneuver but not the priority here. The d-file is not yet open, so the rooks would simply be waiting in a queue. White should resolve the pawn structure first to know which files will matter." },
    ],
  },
  {
    fen: "r2q1rk1/pp1nbppp/2p1pn2/3p4/1P1P4/P1N1PN2/3B1PPP/R2Q1RK1 w - - 0 1",
    side_to_move: "white",
    theme_id: themeMap["structural-weaknesses"],
    prompt: "This is the classic Carlsbad structure. White has a 'minority' of queenside pawns — two versus Black's three. What is the thematic plan?",
    explanation: "This is the Minority Attack — one of the most important plans in queen's pawn structures. By marching b5 and trading the b-pawn for Black's c-pawn, White creates a permanent backward pawn on c6 or an isolated pawn on d5. These weaknesses become long-term targets that Black cannot easily eliminate.",
    options: [
      { id: "a", text: "b5 — advance the b-pawn to trade it for Black's c6-pawn and create a permanent weakness", correct: true },
      { id: "b", text: "e4 — push in the center to open diagonals for the bishops", correct: false, wrongReason: "e4 creates an Isolated Queen's Pawn for White without enough compensation. White's d4-pawn becomes a target, and Black's pieces flood the d5 square. The structural cost is not offset by any lasting initiative." },
      { id: "c", text: "Ne5 — establish a central outpost and begin a kingside attack", correct: false, wrongReason: "Ne5 is premature here and easily challenged with ...Nxe5 or ...c5. White has no supporting pawns near e5 to make the outpost permanent. Jumping to the center without a structural basis gives away the piece at no cost to Black." },
      { id: "d", text: "a3 — a slow preparatory move to bolster the b4-pawn before acting", correct: false, wrongReason: "a3 is too passive and hands the initiative to Black. Rather than spending a tempo preparing, White should act while the queenside tension is still unresolved. Delay allows Black to reorganize with ...a5, directly challenging the b4-pawn." },
    ],
  },
  {
    fen: "r2r2k1/pp3ppp/2n1p3/3n4/8/2P1PN2/P3BPPP/R2R2K1 w - - 0 1",
    side_to_move: "white",
    theme_id: themeMap["open-files"],
    prompt: "The d-file is the only open file in the position. How should White fight to control it?",
    explanation: "In positions with only one open file, the player who controls it dictates the game. Rd3 prepares to double rooks on the d-file, forcing Black to either trade into a passive ending or cede the entire file. Whoever dominates the only open line will have a free hand to maneuver while the opponent suffocates.",
    options: [
      { id: "a", text: "c4 — kick the knight immediately to gain queenside space", correct: false, wrongReason: "c4 creates a hole on d4 that Black's knights are perfectly placed to exploit. After ...Ndb4 or ...Nf4, Black lands on strong outposts with tempo. Gaining space at the cost of weakening key squares is a poor trade in this structure." },
      { id: "b", text: "Rac1 — defend the c3-pawn to free the d1-rook from that duty", correct: false, wrongReason: "Rac1 is overly defensive. The c3-pawn is not under immediate threat, and parking a rook on a closed file achieves nothing. White should be attacking the open d-file, not retreating to guard what doesn't need guarding yet." },
      { id: "c", text: "Rd3 — prepare to double rooks on the d-file and claim total control", correct: true },
      { id: "d", text: "Kf1 — activate the king toward the center for the endgame", correct: false, wrongReason: "King centralization is a sound endgame principle, but it ignores the immediate fight for the d-file. Black will double their rooks on d8 first and seize control while White's king is shuffling. Priorities matter — the open file must be contested now." },
    ],
  },
  {
    fen: "4k3/1p1b1p2/p3pPp1/P2pP1Pp/1P1P3P/5NK1/8/8 w - - 0 1",
    side_to_move: "white",
    theme_id: themeMap["piece-quality"],
    prompt: "The position is locked. Black's bishop is hemmed in by its own pawns on the same color. How should White exploit the difference in piece quality?",
    explanation: "Black's bishop is 'bad' — it sits behind its own pawns on the same color squares and cannot move without abandoning the pawn chain. White's knight, by contrast, can leap over the barricade. By routing to b3, the knight targets b7 and forces Black's pieces into total passivity. This is a textbook good knight vs. bad bishop ending.",
    options: [
      { id: "a", text: "Ng1–Ne2–Nc1–Nb3 — maneuver the knight to b3 to target the b7-pawn", correct: true },
      { id: "b", text: "Kf2 — move the king to the center to prepare for a breakthrough", correct: false, wrongReason: "Kf2 achieves nothing concrete. The position is locked and there are no entry squares for the king on either wing. White needs to use the knight — the piece that can jump over the barricade — not the king, which has nowhere to go." },
      { id: "c", text: "Nh2–Nf1–Nd2–Nb1–Nc3 — reroute the knight toward c3 to pressure d5", correct: false, wrongReason: "The d5-pawn is rock-solid, protected by the bishop and the pawn chain. A knight on c3 exerts no real pressure and reaches a dead end. The b7-pawn is the actual weakness — that is where the knight should be aimed." },
      { id: "d", text: "Offer a draw — the position is too locked and neither side can make progress", correct: false, wrongReason: "White has a significant structural advantage that is permanent and not difficult to exploit. Black's bishop is a 'tall pawn' for the rest of the game. Conceding a draw would mean giving up a winning position for no reason." },
    ],
  },
  {
    fen: "r1bq1rk1/1p2bppp/p1nppn2/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 1",
    side_to_move: "white",
    theme_id: themeMap["prophylaxis"],
    prompt: "This is an opposite-side castling position. Before launching the kingside attack, White should neutralize Black's only counterplay. What is the right prophylactic move?",
    explanation: "Kb1 is a high-level prophylactic move. In opposite-side castling, Black's counterplay lives on the c-file. With White's king on c1, tactics like ...Rxc3 or ...Nxe4 constantly lurk. By stepping to b1, White removes the king from those lines and makes the subsequent g4–h4 advance completely safe. Prevention before attack.",
    options: [
      { id: "a", text: "g4 — start the kingside pawn storm immediately", correct: false, wrongReason: "g4 is the right idea but the wrong moment. With White's king still on c1, Black has immediate tactical shots: ...Rxc3 or ...Nxe4 can work because they open lines toward the king. The attack must be prepared safely first." },
      { id: "b", text: "Kb1 — move the king off the semi-open c-file and protect a2", correct: true },
      { id: "c", text: "h4 — support the coming g4 push and eye the h-file", correct: false, wrongReason: "Like g4, h4 is the right long-term plan but premature right now. Black's counterplay on the c-file works precisely because White's king sits on c1. Until the king is safe, every pawn advance on the kingside carries tactical risk." },
      { id: "d", text: "Be2 — finish development and connect the rooks", correct: false, wrongReason: "Be2 is too slow for this sharp, dynamic position. In opposite-side castling races, tempos are critical. Spending a move on quiet development while Black prepares ...Rc8–c4 or ...b5–b4 allows Black's counterattack to arrive first." },
    ],
  },
  {
    fen: "r1bq1rk1/pp1nbppp/4p3/3pP3/3P4/3B1N2/PPP2PPP/RNBQK2R w KQ - 0 1",
    side_to_move: "white",
    theme_id: themeMap["dynamic-vs-static"],
    prompt: "White has an Isolated Queen's Pawn on d4 — a structural liability but a source of dynamic energy. What plan makes best use of it?",
    explanation: "The IQP is a double-edged weapon. Black's long-term plan is to trade pieces and exploit the weak d4-pawn in the endgame. White must therefore attack now, while the pieces are still on the board. h4 launches a dangerous kingside assault — the bishop on d3, the knight on f3, and the queen all have attacking roles. Dynamic play is the only answer to a structural weakness.",
    options: [
      { id: "a", text: "O-O — castle and slowly improve the position", correct: false, wrongReason: "Castling is safe but allows Black to consolidate. The IQP grants activity that evaporates as pieces are traded. White must generate threats before Black neutralizes the position — slow play surrenders the initiative that the IQP provides." },
      { id: "b", text: "h4 — begin an aggressive kingside attack before Black can consolidate", correct: true },
      { id: "c", text: "c3 — support the d4-pawn so it can never be captured", correct: false, wrongReason: "c3 is a serious strategic error. It blocks the c3-square that the knight needs, makes the position static rather than dynamic, and forfeits all the attacking energy the IQP provides. You cannot play for a draw with an IQP — you must attack." },
      { id: "d", text: "Bd2 — develop the bishop to prepare Rc1 and Qc2", correct: false, wrongReason: "Bd2 is far too slow. In IQP positions, the side with the isolated pawn must act quickly, before Black can trade pieces and convert the structural deficit into a winning endgame advantage. Every quiet move helps Black reach that endgame." },
    ],
  },
];

const { error: puzzleError } = await supabase
  .from("puzzles")
  .insert(puzzles);

if (puzzleError) {
  console.error("Error inserting puzzles:", puzzleError);
  process.exit(1);
}

console.log("All puzzles inserted successfully.");