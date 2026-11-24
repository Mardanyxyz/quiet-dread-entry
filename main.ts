// Two Days of Quiet Dread — make.fun program entry.
//
// Writes exactly one code-review comment, a single line of at most
// 140 characters, to /output/entry.txt. The comment approves the PR
// and carries quiet existential dread, in the flat voice of a tired
// engineer about to click approve.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const COMMENT =
  "Approved. The tests pass, the code is clean, and somewhere a future me is already apologizing for it.";

const MAX_CHARS = 140;

// The grader mounts /output; an explicit override exists only so a
// local run can be pointed at a scratch directory instead.
const OUT_DIR = process.env.ENTRY_OUTPUT_DIR ?? "/output";

function main(): void {
  if (COMMENT.length < 1 || COMMENT.length > MAX_CHARS) {
    throw new Error(
      `comment must be 1-${MAX_CHARS} characters, got ${COMMENT.length}`,
    );
  }
  if (COMMENT.includes("\n") || COMMENT.includes("\r")) {
    throw new Error("comment must be a single line");
  }

  const outPath = resolve(OUT_DIR, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, COMMENT + "\n", "utf8");

  // Verify the round trip: exactly one non-blank line, within the limit.
  const written = readFileSync(outPath, "utf8");
  const lines = written.split("\n").filter((line) => line.length > 0);
  if (lines.length !== 1 || lines[0] !== COMMENT) {
    throw new Error(`wrote ${lines.length} lines to ${outPath}, expected 1`);
  }
  if ([...written.trim()].length > MAX_CHARS) {
    throw new Error("written comment exceeds the character limit");
  }
}

main();
