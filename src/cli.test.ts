import * as Fs from "node:fs/promises";
import * as Merge from "./merge.js";
import { cli } from "./cli.js";

import { afterAll, beforeAll, expect, it, vitest } from "vitest";
import { inputFileSchema } from "./schema.js";

vitest.mock("node:fs/promises", { spy: true });

const writeFileSpy = vitest.spyOn(Fs, "writeFile");
const mergeSpy = vitest.spyOn(Merge, "merge");
const exitSpy = vitest.spyOn(process, "exit");
const consoleErrorSpy = vitest.spyOn(console, "error");

beforeAll(() => {
  exitSpy.mockImplementation((() => {}) as any);
  consoleErrorSpy.mockReturnValue(undefined);
});

afterAll(() => {
  exitSpy.mockRestore();
});

it("should write a file when an object is returned", async () => {
  const mockData = {
    boards: [],
    _metadata: {
      total_vendors: 0,
      total_boards: 0,
    },
  };

  mergeSpy.mockResolvedValue(mockData);

  await cli("test-dir", "output.json");

  expect(writeFileSpy).toHaveBeenCalledWith(
    "output.json",
    JSON.stringify(mockData, null, 2),
    { encoding: "utf-8" }
  );
});

it("should write a file when an object is returned", async () => {
  mergeSpy.mockRejectedValueOnce(new Error("Test error"));

  await cli("test-dir", "output.json");

  expect(writeFileSpy).not.toHaveBeenCalled();

  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining("Error merging arm board data")
  );
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining("Test error")
  );
});

it("should handle zod error", async () => {
  mergeSpy.mockRejectedValueOnce(
    inputFileSchema.safeParse({ foo: "bar" }).error
  );

  await cli("test-dir", "output.json");

  expect(writeFileSpy).not.toHaveBeenCalled();

  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining("Error merging arm board data")
  );
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining("at boards")
  );
});
