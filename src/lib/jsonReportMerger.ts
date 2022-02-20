/**
 * Merger
 * @codejedi365 | DD MMM YYYY
 */
import { DependencyScanningReportSchema as schema } from "@gitlab-org/security-report-schemas";

// Check that both match schema v14
// provide warning if not but attempt to find valid keys, ignore errors and do the best possible

const getEmptyValueOfType = (type: string): unknown => {
  switch (type) {
    case "array": {
      return [];
    }
    case "object": {
      return {};
    }
    case "string": {
      return "";
    }
    default: {
      return undefined;
    }
  }
};

const mergeJSONReports = (
  baseReport: Record<string, unknown>,
  newReport = {}
): Record<string, unknown> => {
  const mergedReport: Record<string, unknown> = {};

  Object.keys(schema.properties).forEach((prop) => {
    if (schema.required.includes(prop)) {
      mergedReport[prop] = getEmptyValueOfType(schema.properties[prop].type);
    }
  });
  return mergedReport;
};

export const mergeReportFiles = async (fileList: string[]): Promise<void> => {
  const is = fileList.length % 2;
};

export default mergeReportFiles;
