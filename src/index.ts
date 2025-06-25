import yargs from "yargs";
import chalk from "chalk";
import { formatError } from "./errors.js";
import { cli } from "./cli.js";

// Reference: https://github.com/yargs/yargs/blob/HEAD/docs/api.md#usagemessagecommand-desc-builder-handler
const argv = yargs(process.argv.slice(2))
  .usage(
    "$0 <dir> <output>",
    "Merges together arm board data into a single JSON file",
    (yargs) => {
      return yargs
        .positional("dir", {
          describe: "The directory to scan for arm board data",
          type: "string",
        })
        .positional("output", {
          describe: "The output file to write the merged data to",
          type: "string",
        });
    }
  )
  .parse();

(async () => {
  try {
    await cli(argv.dir, argv.output);
  } catch (error) {
    console.error(chalk.bold.red("Error merging arm board data"));

    formatError(error);

    process.exit(1);
  }
})();
