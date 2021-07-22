#!/usr/bin/env node
import { processCLIArgs } from "./lib/cli";
import { merger } from "./lib/jsonFileMerger";

function main() {
  const argv = processCLIArgs();
  merger 
}

function exitHandler(exitCode = 0) {
  if (exitCode !== 0) {
    console.error("Merge Failed.");
  } else {
    process.exit();
  }
}

if (require.main === module) {
  // Module run directly from command line
  process.on("exit", exitHandler);
  main();
} else {
  // ELSE: Module not run from command line, likely imported
  // export default {}
}
