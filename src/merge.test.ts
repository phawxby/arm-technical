import * as Fs from "node:fs/promises";

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vitest,
} from "vitest";
import { inputFileSchema } from "./schema.js";
import { merge } from "./merge.js";

vitest.mock("node:fs/promises", { spy: true });

const readdirSpy = vitest.spyOn(Fs, "readdir");
const readFileSpy = vitest.spyOn(Fs, "readFile");

beforeEach(() => {
  readdirSpy.mockResolvedValue([]);
  readFileSpy.mockResolvedValue("{}");
});

it("should throw an error on no files found", async () => {
  await expect(() => merge("non-existent-dir")).rejects.toThrow(
    "No files found in the specified directory"
  );
});

describe("with files", () => {
  beforeEach(() => {
    readdirSpy.mockResolvedValue(["file1.json", "file2.json", "file3.json"]);
  });

  it("should throw an error on bad json", () => {
    readFileSpy.mockResolvedValue("not a json");

    return expect(() => merge("test-dir")).rejects.toThrow(
      "Failed to parse JSON from file"
    );
  });

  it("should throw an error if the json doesn't match the schema", () => {
    readFileSpy.mockResolvedValue(JSON.stringify({ invalid: "data" }));

    return expect(() => merge("test-dir")).rejects.toThrow("invalid_type");
  });

  it("should merge files and return the output correctly sorted with meta data", async () => {
    const baseProps = { core: "foo", has_wifi: true };

    readFileSpy
      .mockResolvedValueOnce(
        JSON.stringify({
          boards: [
            { ...baseProps, vendor: "vendor1", name: "board1" },
            { ...baseProps, vendor: "vendor1", name: "board1" },
            { ...baseProps, vendor: "vendor3", name: "board2" },
            { ...baseProps, vendor: "vendor5", name: "board4" },
          ],
        })
      )
      .mockResolvedValueOnce(
        JSON.stringify({
          boards: [
            { ...baseProps, vendor: "vendor2", name: "board6" },
            { ...baseProps, vendor: "vendor1", name: "board9" },
          ],
        })
      )
      .mockResolvedValueOnce(
        JSON.stringify({
          boards: [
            { ...baseProps, vendor: "vendor8", name: "board5" },
            { ...baseProps, vendor: "vendor5", name: "board3" },
            { ...baseProps, vendor: "vendor2", name: "board7" },
            { ...baseProps, vendor: "vendor8", name: "board1" },
          ],
        })
      );

    const result = await merge("test-dir");

    expect(result._metadata).toMatchObject({
      total_boards: 10,
      total_vendors: 5,
    });

    expect(result.boards).toMatchObject([
      {
        name: "board1",
        vendor: "vendor1",
      },
      {
        name: "board1",
        vendor: "vendor1",
      },
      {
        name: "board9",
        vendor: "vendor1",
      },
      {
        name: "board6",
        vendor: "vendor2",
      },
      {
        name: "board7",
        vendor: "vendor2",
      },
      {
        name: "board2",
        vendor: "vendor3",
      },
      {
        name: "board3",
        vendor: "vendor5",
      },
      {
        name: "board4",
        vendor: "vendor5",
      },
      {
        name: "board1",
        vendor: "vendor8",
      },
      {
        name: "board5",
        vendor: "vendor8",
      },
    ]);
  });
});
