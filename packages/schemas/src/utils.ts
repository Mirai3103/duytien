import z from "zod";

export const base64FileSchema = z.object({
	base64: z.string(),
	fileName: z.string().transform((originalFileName) => {
		return `${Date.now().toString()}-${originalFileName}`;
	}),
});

export type Base64File = z.infer<typeof base64FileSchema>;
