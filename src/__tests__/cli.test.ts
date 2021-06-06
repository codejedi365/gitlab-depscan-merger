import { processCLIArgs } from "../cli";
import thisModule from "../../package.json";

const originalProcessArgv = JSON.stringify(process.argv);
const node$0 = [thisModule.main, ""];

describe("cli", () => {
  let mockProcessStdOut: jest.SpyInstance;
  let mockProcessStdErr: jest.SpyInstance;
  let mockProcessExit: jest.SpyInstance;

  beforeEach(() => {
    mockProcessStdOut = jest
      .spyOn(console, "log")
      .mockImplementation(() => true);
    mockProcessStdErr = jest
      .spyOn(console, "error")
      .mockImplementation(() => true);
    mockProcessExit = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    process.argv = JSON.parse(originalProcessArgv);
  });

  describe("processCLIArgs()", () => {
    describe("help option", () => {
      it("should print out help information to stdout & quit on option --help", () => {
        process.argv = [...node$0, "--help"];
        processCLIArgs();
        expect(mockProcessStdOut).toHaveBeenCalled();
        // expect(mockProcessStdOut).toHaveBeenCalledWith("");
        // TODO !!
        expect(mockProcessStdErr).not.toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalledWith(1);
      });
      it("should print out help information to stdout & quit on option -h", () => {
        process.argv = [...node$0, "-h"];
        processCLIArgs();
        expect(mockProcessStdOut).toHaveBeenCalled();
        // expect(mockProcessStdOut).toHaveBeenCalledWith("");
        // TODO !!
        expect(mockProcessStdErr).not.toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalledWith(1);
      });
    });
    describe("output", () => {
      const inputFile = "input.json";
      it("should set the default when no output file is provided", () => {
        process.argv = [...node$0, inputFile];
        const processedArgs = processCLIArgs();
        expect(processedArgs.output).toEqual("");
        expect(mockProcessExit).not.toHaveBeenCalled();
      });
      it("should set output file when -o option is provided", () => {
        const outputFile = "output.json";
        process.argv = [...node$0, "-o", outputFile, inputFile];
        const processedArgs = processCLIArgs();
        expect(processedArgs.output).toEqual(outputFile);
        expect(mockProcessExit).not.toHaveBeenCalled();
      });
      it("should set output file when --output option is provided", () => {
        const outputFile = "output.json";
        process.argv = [...node$0, "--output", outputFile, inputFile];
        const processedArgs = processCLIArgs();
        expect(processedArgs.output).toEqual(outputFile);
        expect(mockProcessExit).not.toHaveBeenCalled();
      });
    });
    describe("filelist", () => {
      it("should print out error & quit if 0 input files are given", () => {
        process.argv = [...node$0];
        processCLIArgs();
        expect(mockProcessStdOut).not.toHaveBeenCalled();
        expect(mockProcessStdErr).toHaveBeenCalled();
        // check what stderr said?
        expect(mockProcessExit).toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalledWith(1);
      });
      it("should accept 1 file if listed", () => {
        process.argv = [...node$0, "input.json"];
        const processedArgs = processCLIArgs();
        expect(mockProcessExit).not.toHaveBeenCalled();
        expect(processedArgs.infiles).toEqual(["input.json"]);
      });
      it("should accept 2 files if provided", () => {
        process.argv = [...node$0, "input1.json", "input2.json"];
        const processedArgs = processCLIArgs();
        expect(processedArgs.infiles).toEqual(process.argv.slice(-2));
        expect(mockProcessExit).not.toHaveBeenCalled();
      });
    });
    describe("version option", () => {
      it("should print out module version and quit when --version is given", () => {
        process.argv = [...node$0, "--version"];
        processCLIArgs();
        expect(mockProcessStdOut).toHaveBeenCalled();
        expect(mockProcessStdOut).toHaveBeenCalledWith(thisModule.version);
        expect(mockProcessExit).toHaveBeenCalled();
        expect(mockProcessExit).toHaveBeenCalledWith(0);
      });
    });
    describe("Usage", () => {
      it("should print usage error & quit if provided invalid option", () => {
        process.argv = [...node$0, "--invalid"];
        processCLIArgs();
        expect(mockProcessStdOut).not.toHaveBeenCalled();
        expect(mockProcessStdErr).toHaveBeenCalled();
        // Check output is usage info?
        expect(mockProcessExit).toHaveBeenCalledWith(1);
      });
      it("should accept multiple options & preprocess args", () => {
        const outputfile = "output.json";
        const inputFiles = ["input1.json", "input2.json"];
        process.argv = [...node$0, "-o", outputfile, ...inputFiles];
        const processedArgs = processCLIArgs();
        expect(processedArgs.output).toEqual(outputfile);
        expect(processedArgs.infiles).toEqual(inputFiles);
        expect(mockProcessExit).not.toHaveBeenCalled();
      });
    });
  });
});
