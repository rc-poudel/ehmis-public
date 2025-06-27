import { z } from "zod";

export enum ModuleType {
	VISUALIZATION = "VISUALIZATION",
	SECTION = "SECTION",
	DOCUMENTS = "DOCUMENTS",
	STATIC = "STATIC",
}

export const moduleType = z.nativeEnum(ModuleType);

export const baseModuleSchema = z.object({
	id: z.string(),
	type: moduleType,
	label: z.string(),
});

export type BaseModule = z.infer<typeof baseModuleSchema>;
