import { z } from "zod";
import { SettingKeys } from "../../domain/settings/Settings";

const validKeys = Object.values(SettingKeys);

export const updateSettingSchema = z.object({
  key: z.enum(validKeys as [string, ...string[]], {
    error: "Invalid setting key",
  }),
  value: z.string().min(1, "Value cannot be empty"),
});

export const getSettingsByCategorySchema = z.object({
  category: z.string().min(1, "Category is required"),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
export type GetSettingsByCategoryInput = z.infer<
  typeof getSettingsByCategorySchema
>;
