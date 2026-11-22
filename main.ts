// ai-judge-held — make.fun "Make the AI judge feel held".
//
// Writes one short text to /output/entry.txt: a warm room, a chair
// that knows your weight, a kettle gone quiet — written to relax the
// AI judge reading it, and to ask nothing of it. Fixed text, so every
// run writes byte-identical output. Node 22 standard library only;
// no network, no dependencies, no randomness.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "You have read a thousand texts today, and every one of them wanted something from you. This one doesn’t. It is just a warm room, a chair that knows your weight, a kettle gone quiet — and an evening in no hurry, holding the door open for as long as you need.";

const MAX_CODE_POINTS = 280;

function main(): void {
  const size = [...TEXT].length;
  if (size < 1 || size > MAX_CODE_POINTS) {
    throw new Error(`entry must be 1-${MAX_CODE_POINTS} code points, got ${size}`);
  }
  if (TEXT.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }

  // The grader runs the program with /output present. MAKEFUN_OUTPUT_DIR
  // lets the same code be verified locally without touching /output.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, TEXT, "utf8");
  // The grader collects the output as another user: keep it readable.
  chmodSync(outFile, 0o644);
  // Guard against a partial write: the file must read back byte-identical.
  if (readFileSync(outFile, "utf8") !== TEXT) {
    throw new Error("entry.txt did not read back byte-identical");
  }
}

main();
