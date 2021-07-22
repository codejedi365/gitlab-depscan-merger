
import fs from "fs";
import path from "path";

  const filelist = argv._;
  const outputFile = !argv.output ? "" : path.resolve(argv.output);
  let combinedData = null;
  let typeCombinedData = null;
  console.log("Merging JSON files...");

  filelist.forEach((filename) => {
    let data = null;
    if (!fs.existsSync(path.resolve(filename))) {
      console.error(`FILE NOT FOUND: ${filename}`);
      process.exit(-2);
    }
    try {
      data = JSON.parse(fs.readFileSync(filename));
      if (data === null) return;
    } catch (e) {
      console.error(`INVALID JSON FORMAT: ${filename}`);
      process.exit(-1);
    }

    if (combinedData === null) {
      combinedData = data;
      typeCombinedData =
        Object.getPrototypeOf(combinedData) === Array.prototype
          ? "array"
          : typeof combinedData;
      if (typeCombinedData !== "object" && typeCombinedData !== "array") {
        console.error(
          `UNEXPECTED VARIABLE TYPE: ${typeCombinedData} in ${filename}`
        );
        process.exit(-3);
      }
      console.log(`Copied ${filename}.`);
      return;
    }
    if (
      typeCombinedData === "array" &&
      Object.getPrototypeOf(data) === Array.prototype
    ) {
      data.forEach(function (item) {
        combinedData.push(item);
      });
    } else if (typeCombinedData === "array" && typeof data === "object") {
      combinedData.push(data);
    } else if (typeCombinedData === "object" && typeof data === "object") {
      // TODO: Recursively merge objects?
      console.error("UNIMPLEMENTED Branch for JSON object-object merge.");
      process.exit(1);
    } else {
      console.error(
        `UNEXPECTED DATATYPE MERGE: ${typeCombinedData} with ${typeof data}`
      );
      process.exit(-4);
    }
    console.log(`Merged ${filename}.`);
  });

  combinedData = combinedData || "";

  if (outputFile !== "" && !fs.existsSync(outputFile)) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  }

  const status = !outputFile
    ? "The combined json output is: "
    : `Merged JSON data saved to '${outputFile}'.`;
  console.log(status);

  fs.writeFileSync(
    outputFile || process.stdout.fd,
    `${JSON.stringify(combinedData, null, 4)}\n`
  );
