import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { normalize } from "path";
import thisModule from "../package.json";

export interface InputArgs {
  [x: string]: unknown;
  help?: boolean;
  output: string;
  infiles: string[];
  _: string[];
  $0: string;
}

/**
 * Function to process command line arguments from the user to parse
 * for validity and return as a common format for use.  Will also wrap
 * with help & version response and formatting.
 * @param argList list of cli args, default is to use `process.argv` directly.
 * @returns argv as an indexable object defined by yargs
 */
export function processCLIArgs(argList: string[] = process.argv): InputArgs {
  // process.stdout.write(`process.argv = ${JSON.stringify(argList)}\n`);
  const result = yargs(hideBin(argList))
    .alias("h", "help")
    .help("help")
    .usage(
      "$0 [-o <outfile>] <infiles...>",
      "Merge GitLab report files into one output file"
    )
    .options({
      output: {
        alias: "o",
        describe: "An output file to save the combined json",
        default: "",
        defaultDescription: "(piped to stdout)",
        nargs: 1,
        normalize: true,
        type: "string"
      }
    })
    .check((argv) => {
      // process.stdout.write(`argv = ${JSON.stringify(argv)}\n`);
      if (argv.help) {
        throw new Error(" "); // tricks Yargs to only printing help info with an extra \n at end.
      }
      const filePaths = argv.infiles as InputArgs["infiles"];
      if (filePaths.length < 1) {
        throw new Error("At least 1 input file must be specified.");
      } else {
        return true; // tell Yargs that the arguments passed the check
      }
    })
    // .middleware((argv) => {
    //   // Normalize any passed in filepaths
    //   const filePaths = argv._;
    //   const normalizedFilePaths = filePaths.map((filePath) =>
    //     normalize(filePath.toString())
    //   );
    //   return { ...argv, _: normalizedFilePaths };
    // })
    .version()
    .describe("version", "show version information")
    .parse() as InputArgs;
  // process.stdout.write(`result = ${JSON.stringify(result)}\n`);
  return result;
}

export default { processCLIArgs };
