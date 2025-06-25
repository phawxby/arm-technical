import chalk from "chalk";
import { ZodError, z } from "zod/v4";

export class DirectoryNotFoundError extends Error {
  constructor(public readonly dir: string, public readonly subError?: Error) {
    super(`Directory not found: ${dir}`);
    this.name = "DirectoryNotFoundError";
  }
}

export class FileNotFoundError extends Error {
  constructor(public readonly file: string, public readonly subError?: Error) {
    super(`File not found: ${file}`);
    this.name = "FileNotFoundError";
  }
}

export const formatError = (error: unknown): void => {
  let message: string;

  if (
    error instanceof DirectoryNotFoundError ||
    error instanceof FileNotFoundError
  ) {
    message = error.message;
  } else if (
    error instanceof ZodError ||
    // A little bit of funk here needed to make this work
    // https://github.com/colinhacks/zod/issues/515#issuecomment-890605766
    (error as any)?.name === "ZodError"
  ) {
    message = z.prettifyError(error as ZodError);
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }

  console.error(chalk.red(message));
};
