import { merge } from "./merge.js";
import chalk from "chalk";
import { formatError } from "./errors.js";
import { writeFile } from "node:fs/promises";

export const cli = async (dir: string, output: string): Promise<void> => {
  try {
    const result = await merge(dir);

    await writeFile(output, JSON.stringify(result, null, 2), {
      encoding: "utf-8",
    });
  } catch (error) {
    console.error(chalk.bold.red("Error merging arm board data"));

    formatError(error);

    process.exit(1);
  }
};
