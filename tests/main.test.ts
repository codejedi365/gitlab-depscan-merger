import { unlink } from "fs/promises";
import { promisify } from "util";
import path from "path";
import * as subprocess from "child_process";

const subprocessExec = promisify(subprocess.exec);
const cli = global.CLI_EXECUTABLE;
const defaultOutputFilename = "gl-dependency-scanning-complete-report.json";
const resultsDirectory = path.resolve(__dirname, "__snapshots__");
const inputFiles = [
  path.resolve(__dirname, "reports", "input1.json"), // 1 vul with fix
  path.resolve(__dirname, "reports", "input2.json"), // 1 vul w/o fix
  path.resolve(__dirname, "reports", "input3.json"), // 2 vul with fixes
  path.resolve(__dirname, "reports", "duplicate1.json"), // report contains same vul & fix as input1
  path.resolve(__dirname, "reports", "zeroVul.json") // 0 vul in report
];

describe("gitlab-depscan-merger", () => {
  describe("defaultOutputFile", () => {
    afterEach(async () => {
      // TO DEBUG
      // 1. comment out this line
      // 2. use it.only() to isolate testcase
      // 3. Run test & find output file on filesystem
      // 4. replace snapshot file with result & use diff to isolate changes
      // 5. git restore files & reverse steps once debugged!
      await unlink(defaultOutputFilename);
    });

    it("should merge 2 reports together correctly", async () => {
      const expectedOutputFile = path.resolve(
        resultsDirectory,
        "merge2files.json"
      );
      const outputFile = defaultOutputFilename;
      await expect(
        subprocessExec(`${cli} ${inputFiles.slice(0, 2).join(" ")}`)
      ).resolves.toBeTruthy();
      await expect(global.sha256sum(outputFile)).resolves.toEqual(
        await global.sha256sum(expectedOutputFile)
      );
    });

    it("should merge 3 reports together when provided", async () => {
      const expectedOutputFile = path.resolve(
        resultsDirectory,
        "merge3files.json"
      );
      const outputFile = defaultOutputFilename;
      await expect(
        subprocessExec(`${cli} ${inputFiles.slice(0, 3).join(" ")}`)
      ).resolves.toBeTruthy();
      await expect(global.sha256sum(outputFile)).resolves.toEqual(
        await global.sha256sum(expectedOutputFile)
      );
    });

    it("should merge 4 reports together when provided", async () => {
      const expectedOutputFile = path.resolve(
        resultsDirectory,
        "merge4files.json"
      );
      const outputFile = defaultOutputFilename;
      await expect(
        subprocessExec(`${cli} ${inputFiles.slice(0, 4).join(" ")}`)
      ).resolves.toBeTruthy();
      await expect(global.sha256sum(outputFile)).resolves.toEqual(
        await global.sha256sum(expectedOutputFile)
      );
    });

    it("should merge 5 reports together when provided", async () => {
      const expectedOutputFile = path.resolve(
        resultsDirectory,
        "merge5files.json"
      );
      const outputFile = defaultOutputFilename;
      await expect(
        subprocessExec(`${cli} ${inputFiles.join(" ")}`)
      ).resolves.toBeTruthy();
      await expect(global.sha256sum(outputFile)).resolves.toEqual(
        await global.sha256sum(expectedOutputFile)
      );
    });
    it("should not fail & only emit warning if 1 report is provided", async () => {
      const expectedOutputFile = inputFiles[0];
      const outputFile = defaultOutputFilename;
      const promise = subprocessExec(
        `${cli} ${inputFiles.slice(0, 1).join(" ")}`
      );
      await expect(promise).resolves.toBeTruthy();
      expect((await promise).stdout).toMatch(
        `Results saved to ${expectedOutputFile}.`
      );
      expect((await promise).stderr).toMatch(
        "Nothing to merge! Only received 1 file for input."
      );
      await expect(global.sha256sum(outputFile)).resolves.toEqual(
        await global.sha256sum(expectedOutputFile)
      );
    });
    // "should handle piped input as a report"
  });

  describe("customOutputFile", () => {
    const customOutputFile = "combinedreport.json";

    afterEach(async () => {
      await unlink(customOutputFile);
    });

    it("should merge reports into specified output file", async () => {
      const expectedOutputFile = path.resolve(
        resultsDirectory,
        "merge2files.json"
      );
      await expect(
        subprocessExec(
          `${cli} -o ${customOutputFile} ${inputFiles.slice(0, 2).join(" ")}`
        )
      ).resolves.toBeTruthy();
      await expect(global.sha256sum(customOutputFile)).resolves.toEqual(
        await global.sha256sum(expectedOutputFile)
      );
    });
  });

  describe("Program Functions", () => {
    it("should show help information when on --help", async () => {
      const promise = subprocessExec(`${cli} --help`);
      await expect(promise).resolves.toBeTruthy();
      expect((await promise).stdout).toMatch(
        "A helper script that merges JSON arrays in multiple files together into one array."
      );
      expect((await promise).stderr).toBeFalsy();
    });
    it("should show help information when on -h", async () => {
      const promise = subprocessExec(`${cli} -h`);
      await expect(promise).resolves.toBeTruthy();
      expect((await promise).stdout).toMatch(
        "A helper script that merges JSON arrays in multiple files together into one array."
      );
      expect((await promise).stderr).toBeFalsy();
    });
    it("should return error message & usage if 0 reports provided", async () => {
      const promise = subprocessExec(`${cli}`);
      await expect(promise).rejects.toBeTruthy();
      expect((await promise).stdout).toBeFalsy();
      expect((await promise).stderr).toMatch(
        "At least 1 input file must be specified."
      );
      expect((await promise).stderr).toMatch(
        "Usage: $0 [-o <file>] <files> ..."
      );
    });
    it("should return usage error on invalid cli option --invalid", async () => {
      const promise = subprocessExec(`${cli} --invalid`);
      await expect(promise).rejects.toBeTruthy();
      expect((await promise).stdout).toBeFalsy();
      expect((await promise).stderr).toMatch(
        "Usage: $0 [-o <file>] <files> ..."
      );
    });
  });
});
