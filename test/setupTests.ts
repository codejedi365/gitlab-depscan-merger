/**
 * FILE: setupTests.js
 * JEST HOOK: setupFilesAfterEnv
 * ------------------------------
 * Configures jest test environment for all tests
 * ------------------------------
 * codejedi365 | DD MMM YYYY
 */
import { createHash } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import thisModule from "../package.json";

declare global {
  /* eslint-disable no-var, vars-on-top */
  var PROJECT_ROOT: string;
  var CLI_EXECUTABLE: string;
  var DEV_ENTRYPOINT: string;
  /* eslint-enable no-var, vars-on-top */

  function sha256sum(filepath: string): Promise<string>;
}

global.PROJECT_ROOT = path.dirname(__dirname);

global.CLI_EXECUTABLE =
  process.env.NODE_ENV === "production"
    ? path.resolve(global.PROJECT_ROOT, thisModule.main)
    : path.resolve(global.PROJECT_ROOT, global.DEV_ENTRYPOINT); // dev entrypoint

// console.log(`Tests running in ${process.env.NODE_ENV || "development"} mode.`);
// console.log(
//   `Entrypoint: ${global.PARSER_CLI.replace(global.PROJECT_ROOT, "")}`
// );

global.sha256sum = async function sha256sum(filepath: string): Promise<string> {
  const hash = createHash("sha256");
  const data = await readFile(filepath);
  hash.update(data);
  return hash.digest("hex");
};
