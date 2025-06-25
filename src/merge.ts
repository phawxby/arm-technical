import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { DirectoryNotFoundError, FileNotFoundError } from "./errors";
import { InputFileSchema, inputFileSchema, OutputFileSchema } from "./schema";

export const merge = async (dir: string): Promise<OutputFileSchema> => {
  const files = await getFilenames(dir);

  if (files.length === 0) {
    throw new Error("No files found in the specified directory");
  }

  const contents = await Promise.all(files.map(parse));

  return produceOutput(contents);
};

export const produceOutput = (input: InputFileSchema[]): OutputFileSchema => {
  const allBoards = input
    .flatMap((file) => file.boards)
    .sort(
      (a, b) =>
        // Perform a chained sort. When the 2 match they return 0 so the next one is used
        a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name)
    );

  const allVendorNames = new Set(allBoards.map((board) => board.vendor));

  return {
    boards: allBoards,
    _metadata: {
      total_vendors: allVendorNames.size,
      total_boards: allBoards.length,
    },
  };
};

export const getFilenames = async (dir: string): Promise<string[]> => {
  try {
    const files = await readdir(dir);

    return files.map((file) => join(dir, file));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new DirectoryNotFoundError(dir);
    } else {
      throw error;
    }
  }
};

export const parse = async (filePath: string): Promise<InputFileSchema> => {
  let rawJson: string | undefined;

  try {
    rawJson = await readFile(filePath, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new FileNotFoundError(filePath);
    } else {
      throw error;
    }
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON from file: ${filePath}. Error: ${error.message}`
    );
  }

  return inputFileSchema.parse(parsedJson);
};
