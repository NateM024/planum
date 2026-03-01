import { useState } from "react";
import { PUZZLES } from "./puzzles";

// ============================================================
// Constants
// ============================================================
const PIECE_UNICODE = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

const THEME_LABELS = {
  central_control:       "Central Control",
  structural_weaknesses: "Structural Weaknesses",
  open_files:            "Open Files",
  piece_quality:         "Piece Quality",
  prophylaxis:           "Prophylaxis",
  dynamic_vs_static:     "Dynamic vs. Static",
};

const FEATURES = [
  {
    glyph: "♟",
    title: "Plans, not moves",
    body: "Every puzzle presents a strategic situation and asks you to choose the right idea — not a specific move or forcing variation. Calculation is never the point.",
  },
  {
    glyph: "♜",
    title: "Pure positional thinking",
    body: "Puzzles are built around pawn structures, weak squares, piece activity, and long-term imbalances — the foundations of how strong players actually think.",
  },
  {
    glyph: "♞",
    title: "Explanations, not scores",
    body: "After every answer you get a clear explanation of the strategic idea — focused on understanding why a plan is good, not on points or ratings.",
  },
];

// ============================================================
// Utilities
// ============================================================
function fenToBoard(fen) {
  return fen.split(" ")[0].split("/").map((rank) => {
    const row = [];
    for (const ch of rank) {
      if (isNaN(ch)) row.push(ch);
      else for (let i = 0; i < parseInt(ch); i++) row.push(null);
    }
    return row;
  });
}

// ============================================================
// Shared: Logo
// ============================================================
function Logo({ onClick }) {
  return (
    <button
      onClick={onClick}
      className={onClick ? "logo-link" : ""}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "none", border: "none",
        cursor: onClick ? "pointer" : "default",
        padding: 0,
      }}
    >
      <span style={{ fontSize: 27, color: "#c8a84b", lineHeight: 1 }}>♟</span>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 22, fontWeight: 700,
        letterSpacing: "0.02em", color: "#f5e6c0",
      }}>
        Planum
      </span>
    </button>
  );
}

// ============================================================
// Ghost chessboard — decorative, homepage only
// ============================================================
function GhostBoard({ size = 50, opacity = 0.10 }) {
  return (
    <div style={{
      display: "inline-grid",
      gridTemplateColumns: `repeat(8, ${size}px)`,
      gridTemplateRows: `repeat(8, ${size}px)`,
      borderRadius: 3, overflow: "hidden",
      boxShadow: `0 16px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,168,75,${opacity * 0.6})`,
    }}>
      {Array.from({ length: 64 }, (_, i) => {
        const r = Math.floor(i / 8), f = i % 8;
        const light = (r + f) % 2 === 0;
        return (
          <div key={i} style={{
            width: size, height: size,
            background: light
              ? `rgba(240,217,181,${opacity * 1.5})`
              : `rgba(181,136,99,${opacity})`,
          }} />
        );
      })}
    </div>
  );
}

// ============================================================
// Chessboard — view-only, used on puzzle page
// ============================================================
function Chessboard({ fen, flipped }) {
  const board = fenToBoard(fen);
  const ranks = flipped ? [...board].reverse() : board;
  const files = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const fileLabels = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const rankLabels = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const sqSize = 62;

  return (
    <div style={{
      display: "inline-block", borderRadius: 4, overflow: "hidden",
      boxShadow: "0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "inline-block", userSelect: "none" }}>
        {ranks.map((row, ri) => (
          <div key={ri} style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              width: 18, textAlign: "center", fontSize: 11,
              color: "rgba(255,255,255,0.38)", fontFamily: "monospace",
            }}>
              {flipped ? rankLabels[7 - ri] : rankLabels[ri]}
            </span>
            {files.map((fi) => {
              const piece = row[fi];
              const isLight = (ri + fi) % 2 === 0;
              const isWhitePiece = piece && piece === piece.toUpperCase();
              return (
                <div key={fi} style={{
                  width: sqSize, height: sqSize,
                  background: isLight ? "#f0d9b5" : "#b58863",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {piece && (
                    <span style={{
                      fontSize: 44, lineHeight: 1, cursor: "default",
                      color: isWhitePiece ? "#fff" : "#1a1a1a",
                      textShadow: isWhitePiece
                        ? "0 1px 4px rgba(0,0,0,0.95), 0 0 1px #000"
                        : "0 1px 2px rgba(255,255,255,0.25)",
                    }}>
                      {PIECE_UNICODE[piece]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ display: "flex" }}>
          <span style={{ width: 18 }} />
          {files.map((fi) => (
            <span key={fi} style={{
              width: sqSize, textAlign: "center",
              fontSize: 11, color: "rgba(255,255,255,0.38)",
              fontFamily: "monospace", paddingBottom: 3,
            }}>
              {fileLabels[fi]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ThemeBadge
// ============================================================
function ThemeBadge({ theme }) {
  return (
    <span style={{
      fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
      color: "#c8a84b", border: "1px solid rgba(200,168,75,0.38)",
      borderRadius: 3, padding: "3px 9px",
    }}>
      {THEME_LABELS[theme] || theme}
    </span>
  );
}

// ============================================================
// AnswerOption
// ============================================================
function AnswerOption({ option, selected, submitted, inspected, onSelect, onInspect }) {
  const isWrongAndUnselected = submitted && !option.correct && !selected;
  const isInspected = submitted && inspected;

  let bg = "transparent";
  let border = "1px solid rgba(255,255,255,0.11)";
  let color = "#ddd5c5";

  if (selected && !submitted)                    { bg = "rgba(200,168,75,0.14)";  border = "1px solid #c8a84b";               color = "#f5e6c0"; }
  if (submitted && option.correct)               { bg = "rgba(72,187,120,0.16)";  border = "1px solid #48bb78";               color = "#9ae6b4"; }
  if (submitted && selected && !option.correct)  { bg = "rgba(252,129,74,0.16)";  border = "1px solid #fc814a";               color = "#fbd38d"; }
  if (isInspected && !option.correct)            { bg = "rgba(252,129,74,0.09)";  border = "1px solid rgba(252,129,74,0.55)"; color = "#e8c8a0"; }

  function handleClick() {
    if (!submitted) { onSelect(option.id); return; }
    if (!option.correct && !selected) {
      onInspect(inspected ? null : option.id);
    }
  }

  const showHint = isWrongAndUnselected && !inspected;

  return (
    <div>
      <button
        onClick={handleClick}
        className={isWrongAndUnselected ? "wrong-opt-btn" : ""}
        title={isWrongAndUnselected ? "Click to see why this plan falls short" : undefined}
        style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          width: "100%", padding: "13px 15px",
          borderRadius: isInspected ? "5px 5px 0 0" : 5,
          textAlign: "left", fontSize: 16.5, lineHeight: 1.55,
          background: bg, border, color,
          cursor: submitted ? (isWrongAndUnselected ? "pointer" : "default") : "pointer",
          opacity: submitted && !option.correct && !selected && !inspected ? 0.52 : 1,
          transition: "all 0.14s ease",
          fontFamily: "inherit",
          borderBottom: isInspected ? "1px solid rgba(252,129,74,0.2)" : undefined,
        }}
      >
        <span style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: 3,
          background: "rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11.5, fontWeight: "bold", marginTop: 2,
          fontFamily: "monospace",
        }}>
          {option.id.toUpperCase()}
        </span>
        <span style={{ flex: 1 }}>{option.text}</span>
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
          {submitted && option.correct && (
            <span style={{ color: "#68d391", fontWeight: "bold", fontSize: 18 }}>✓</span>
          )}
          {submitted && selected && !option.correct && (
            <span style={{ color: "#fc8181", fontWeight: "bold", fontSize: 18 }}>✗</span>
          )}
          {showHint && (
            <span style={{
              fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.06em",
              borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: 1,
            }}>
              why?
            </span>
          )}
          {isInspected && (
            <span style={{ fontSize: 13, color: "rgba(252,129,74,0.7)" }}>▲</span>
          )}
        </span>
      </button>

      {isInspected && option.wrongReason && (
        <div className="reason-panel" style={{
          padding: "12px 15px 13px 49px",
          background: "rgba(252,129,74,0.07)",
          border: "1px solid rgba(252,129,74,0.3)",
          borderTop: "none",
          borderRadius: "0 0 5px 5px",
        }}>
          <p style={{
            fontSize: 15, lineHeight: 1.7,
            color: "rgba(240,210,180,0.82)",
            margin: 0, fontWeight: 300, fontStyle: "italic",
          }}>
            {option.wrongReason}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ProgressBar — thin line at top of puzzle page
// ============================================================
function ProgressBar({ current, total }) {
  return (
    <div style={{
      width: "100%", height: 2,
      background: "rgba(255,255,255,0.07)", borderRadius: 2, marginBottom: 38,
    }}>
      <div style={{
        height: "100%", width: `${(current / total) * 100}%`,
        background: "linear-gradient(90deg,#c8a84b,#e8c86a)",
        borderRadius: 2, transition: "width 0.5s ease",
      }} />
    </div>
  );
}

// ============================================================
// HomePage
// ============================================================
function HomePage({ onPlay }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#141210",
      color: "#e8e0d0", fontFamily: "'Crimson Pro', Georgia, serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 50% at 75% 38%, rgba(200,168,75,0.075) 0%, transparent 65%),
          radial-gradient(ellipse 40% 45% at 15% 72%, rgba(181,136,99,0.05) 0%, transparent 60%)
        `,
      }} />

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px", opacity: 0.6,
      }} />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 2,
        borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 44px",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", height: 68 }}>
          <Logo onClick={null} />
        </div>
      </header>

      {/* Hero */}
      <section style={{
        position: "relative", zIndex: 2,
        maxWidth: 1180, margin: "0 auto",
        padding: "80px 44px 56px",
        display: "grid", gridTemplateColumns: "minmax(0,1fr) auto",
        gap: "64px", alignItems: "center",
      }}>
        <div>
          {/* Eyebrow */}
          <div className="anim-0" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
            <div style={{
              height: 1, width: 36, background: "#c8a84b",
              transformOrigin: "left", animation: "lineGrow 0.5s ease 0.05s both",
            }} />
            <span style={{
              fontSize: 11.5, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#c8a84b", fontWeight: 600,
            }}>
              Chess Strategy Training
            </span>
          </div>

          {/* Headline */}
          <h1 className="anim-1" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(44px, 6.5vw, 78px)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.015em", color: "#f5e6c0", marginBottom: 8,
          }}>
            Think in
          </h1>
          <h1 className="anim-2" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(44px, 6.5vw, 78px)", fontWeight: 900,
            fontStyle: "italic", lineHeight: 1.06, letterSpacing: "-0.01em", marginBottom: 30,
            background: "linear-gradient(100deg, #e8c86a 0%, #c8a84b 35%, #a07830 60%, #c8a84b 80%, #e8c86a 100%)",
            backgroundSize: "220% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            animation: "shimmer 4.5s linear 0.8s infinite",
          }}>
            plans.
          </h1>

          {/* Tagline */}
          <p className="anim-3" style={{
            fontSize: "clamp(18px, 2.3vw, 22px)", lineHeight: 1.65,
            color: "rgba(232,224,208,0.65)", fontWeight: 300, maxWidth: 520, marginBottom: 44,
          }}>
            Strategy puzzles that develop positional judgment. No tactics,
            no engine scores, no calculation — just the ideas behind good chess.
          </p>

          {/* CTA */}
          <div className="anim-4" style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <button
              onClick={onPlay}
              className="play-btn"
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "17px 38px", background: "#c8a84b", color: "#141210",
                border: "none", borderRadius: 4, fontSize: 18, fontWeight: 700,
                letterSpacing: "0.07em", fontFamily: "'Playfair Display', Georgia, serif", cursor: "pointer",
              }}
            >
              <span>Begin Training</span>
              <span style={{ fontSize: 21, marginTop: 1 }}>→</span>
            </button>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em", margin: 0 }}>
              {PUZZLES.length} puzzles &nbsp;·&nbsp; free &nbsp;·&nbsp; no account needed
            </p>
          </div>
        </div>

        {/* Ghost board */}
        <div className="board-float" style={{ flexShrink: 0 }}>
          <GhostBoard size={50} opacity={0.14} />
        </div>
      </section>

      {/* Divider */}
      <div className="anim-4" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 44px", position: "relative", zIndex: 2 }}>
        <div style={{
          height: 1, marginBottom: 56,
          background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.25) 25%, rgba(200,168,75,0.25) 75%, transparent)",
        }} />
      </div>

      {/* Feature cards */}
      <section style={{
        position: "relative", zIndex: 2,
        maxWidth: 1180, margin: "0 auto", padding: "0 44px 96px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18,
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} className={`feature-card anim-${4 + i}`} style={{
            padding: "30px 28px 28px",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 6, background: "rgba(255,255,255,0.018)",
          }}>
            <div style={{ fontSize: 34, lineHeight: 1, color: "#c8a84b", marginBottom: 16 }}>{f.glyph}</div>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 19, fontWeight: 700, color: "#f0e8d5", marginBottom: 10,
            }}>{f.title}</h3>
            <p style={{ fontSize: 16.5, lineHeight: 1.72, color: "rgba(232,224,208,0.52)", fontWeight: 300, margin: 0 }}>
              {f.body}
            </p>
          </div>
        ))}
      </section>

      {/* Quote */}
      <div className="anim-6" style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "0 44px 80px" }}>
        <blockquote style={{ borderLeft: "2px solid rgba(200,168,75,0.35)", paddingLeft: 28, maxWidth: 620 }}>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(17px, 2vw, 20px)", fontStyle: "italic",
            lineHeight: 1.65, color: "rgba(232,224,208,0.45)", margin: 0,
          }}>
            "Chess is not about finding the best move. It is about forming the right plan."
          </p>
          <footer style={{
            marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            — Siegbert Tarrasch
          </footer>
        </blockquote>
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 2,
        borderTop: "1px solid rgba(255,255,255,0.05)", padding: "22px 44px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}>
          Planum — train the part of chess that matters most
        </span>
        <button
          onClick={onPlay}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: "rgba(200,168,75,0.5)",
            letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#c8a84b")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(200,168,75,0.5)")}
        >
          Start training →
        </button>
      </footer>
    </div>
  );
}

// ============================================================
// PuzzlePage
// ============================================================
function PuzzlePage({ onHome }) {
  const [idx, setIdx]               = useState(0);
  const [selectedId, setSelected]   = useState(null);
  const [submitted, setSubmitted]   = useState(false);
  const [inspectedId, setInspected] = useState(null);

  const puzzle    = PUZZLES[idx];
  const isCorrect = submitted && puzzle.options.find((o) => o.id === selectedId)?.correct;
  const isLast    = idx === PUZZLES.length - 1;
  const flipped   = puzzle.sideToMove === "black";

  function next()    { setIdx((i) => i + 1); setSelected(null); setSubmitted(false); setInspected(null); }
  function restart() { setIdx(0);             setSelected(null); setSubmitted(false); setInspected(null); }

  return (
    <div className="screen-enter" style={{
      minHeight: "100vh", background: "#141210",
      color: "#e8e0d0", fontFamily: "'Crimson Pro', Georgia, serif",
    }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 36px" }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
        }}>
          <Logo onClick={onHome} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Puzzle {idx + 1} / {PUZZLES.length}
          </span>
        </div>
      </header>

      <main style={{ padding: "36px 36px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <ProgressBar current={idx} total={PUZZLES.length} />

          <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Board */}
            <div style={{ flexShrink: 0 }}>
              <Chessboard fen={puzzle.fen} flipped={flipped} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, paddingLeft: 18 }}>
                <div style={{
                  width: 11, height: 11, borderRadius: "50%",
                  background: flipped ? "#2a2a2a" : "#f0f0eb",
                  border: "2px solid rgba(255,255,255,0.22)",
                }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
                  {puzzle.sideToMove === "white" ? "White" : "Black"} to plan
                </span>
              </div>
            </div>

            {/* Puzzle UI */}
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              {/* Theme badge + progress dots */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <ThemeBadge theme={puzzle.theme} />
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {PUZZLES.map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: i <= idx ? "#c8a84b" : "rgba(255,255,255,0.11)",
                      transition: "background 0.3s ease",
                    }} />
                  ))}
                </div>
              </div>

              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20, lineHeight: 1.5, fontWeight: 400, color: "#f0e8d5", marginBottom: 26,
              }}>
                {puzzle.prompt}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: submitted ? 6 : 22 }}>
                {puzzle.options.map((opt) => (
                  <AnswerOption
                    key={opt.id}
                    option={opt}
                    selected={selectedId === opt.id}
                    submitted={submitted}
                    inspected={inspectedId === opt.id}
                    onSelect={setSelected}
                    onInspect={setInspected}
                  />
                ))}
              </div>

              {/* Explore hint */}
              {submitted && puzzle.options.some((o) => !o.correct && o.id !== selectedId) && (
                <p style={{
                  fontSize: 13, color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.03em", marginBottom: 18, fontStyle: "italic",
                }}>
                  Click any other option to see why it falls short.
                </p>
              )}

              {/* Confirm button */}
              {!submitted && (
                <button
                  onClick={() => selectedId && setSubmitted(true)}
                  disabled={!selectedId}
                  style={{
                    width: "100%", padding: "13px",
                    background: selectedId ? "#c8a84b" : "rgba(200,168,75,0.18)",
                    color: selectedId ? "#141210" : "rgba(255,255,255,0.25)",
                    border: "none", borderRadius: 5, fontSize: 15.5, fontWeight: 700,
                    letterSpacing: "0.08em", fontFamily: "inherit",
                    cursor: selectedId ? "pointer" : "not-allowed", transition: "all 0.15s",
                  }}
                >
                  Confirm Plan
                </button>
              )}

              {/* Result + explanation */}
              {submitted && (
                <div>
                  <div style={{
                    padding: "16px 18px", borderRadius: 5, marginBottom: 15,
                    background: isCorrect ? "rgba(72,187,120,0.11)" : "rgba(252,129,74,0.11)",
                    borderLeft: `3px solid ${isCorrect ? "#48bb78" : "#fc814a"}`,
                  }}>
                    <span style={{
                      display: "block", marginBottom: 9, fontSize: 12, fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: isCorrect ? "#68d391" : "#fc8181",
                    }}>
                      {isCorrect ? "Correct plan!" : "Not quite — here's why:"}
                    </span>
                    <p style={{
                      fontSize: 16.5, lineHeight: 1.75,
                      color: "rgba(224,212,192,0.82)", margin: 0, fontWeight: 300,
                    }}>
                      {puzzle.explanation}
                    </p>
                  </div>

                  {!isLast ? (
                    <button onClick={next} className="next-btn" style={{
                      width: "100%", padding: "13px", background: "transparent", color: "#c8a84b",
                      border: "1px solid rgba(200,168,75,0.5)", borderRadius: 5, fontSize: 15.5,
                      letterSpacing: "0.06em", fontFamily: "inherit", cursor: "pointer",
                    }}>
                      Next Puzzle →
                    </button>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <p style={{
                        color: "rgba(255,255,255,0.35)", fontSize: 15.5,
                        marginBottom: 14, fontStyle: "italic", fontWeight: 300,
                      }}>
                        You've worked through all {PUZZLES.length} puzzles. Well played.
                      </p>
                      <button onClick={restart} className="next-btn" style={{
                        width: "100%", padding: "13px", background: "transparent", color: "#c8a84b",
                        border: "1px solid rgba(200,168,75,0.5)", borderRadius: 5, fontSize: 15.5,
                        letterSpacing: "0.06em", fontFamily: "inherit", cursor: "pointer",
                      }}>
                        Start Over
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// App — screen router
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("home");
  const [key, setKey] = useState(0);

  function goPlay() { setKey((k) => k + 1); setScreen("puzzle"); }
  function goHome() { setKey((k) => k + 1); setScreen("home"); }

  if (screen === "home") return <HomePage key={key} onPlay={goPlay} />;
  return <PuzzlePage key={key} onHome={goHome} />;
}
