import { expect, it } from "vitest";
import { merge } from "../src/merge.js";
import { join } from "path";

it("should merge files and return the output correctly sorted with meta data", async () => {
  const result = await merge(join(__dirname, "../example-boards"));

  expect(result).toMatchObject({
    boards: [
      {
        name: "B7-400X",
        vendor: "Boards R Us",
        core: "Cortex-M7",
        has_wifi: true,
      },
      {
        name: "D4-200S",
        vendor: "Boards R Us",
        core: "Cortex-M4",
        has_wifi: false,
      },
      {
        name: "Low_Power",
        vendor: "Tech Corp.",
        core: "Cortex-M0+",
        has_wifi: false,
      },
    ],
    _metadata: {
      total_vendors: 2,
      total_boards: 3,
    },
  });
});
