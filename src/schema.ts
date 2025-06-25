import { z } from "zod";

export const inputFileSchema = z.object({
  boards: z.array(
    z.object({
      name: z.string(),
      vendor: z.string(),
      core: z.string(),
      has_wifi: z.boolean(),
    })
  ),
});

export type InputFileSchema = z.output<typeof inputFileSchema>;

export const outputFileSchema = z.object({
  boards: z.array(
    z.object({
      name: z.string(),
      vendor: z.string(),
      core: z.string(),
      has_wifi: z.boolean(),
    })
  ),
  _metadata: z.object({
    total_vendors: z.number(),
    total_boards: z.number(),
  }),
});

export type OutputFileSchema = z.output<typeof outputFileSchema>;
