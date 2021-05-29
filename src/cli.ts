import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import thisModule from "../package.json";

type InputArgs = Record<string, unknown> & {
  _: string[];
  output: string;
};

/**
 * Function to process command line arguments from the user to parse
 * for validity and return as a common format for use.  Will also wrap
 * with help & version response and formatting.
 * @param argList list of cli args, default is to use `process.argv` directly.
 * @returns argv as an indexable object defined by yargs
 */
export function processCLIArgs(argList: string[] = process.argv): InputArgs {
  return yargs(hideBin(argList))
    .alias("h", "help")
    .help(
      "h",
      "A helper script that merges JSON arrays in multiple files together into one array."
    )
    .usage("Usage: $0 [-o <file>] <files> ...")
    .version(thisModule.version)
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
      const filePaths = argv._;
      if (filePaths.length < 1) {
        throw new Error("At least 1 input file must be specified.");
      } else {
        return true; // tell Yargs that the arguments passed the check
      }
    })
    .parse() as InputArgs;
}

export default { processCLIArgs };
