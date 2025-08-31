import * as z from "zod/v4";
import { BadRequestError } from "../../../utils/error";

export const createTagsSchema = z.object({
  names: z
    .array(z.string("Tag name is required"))
    .min(1, "You must provide at least one directory name"),
});
export class CreateTagDto {
  constructor(public name: string) {}

  static validate(data: z.infer<typeof createTagsSchema>) {
    const { success, error, data: result } = createTagsSchema.safeParse(data);
    if (success) {
      return result.names;
    }

    const errMsgs = error.issues.map((response) => {
      return response.message;
    });

    throw new BadRequestError(errMsgs[0]);
  }
}

export type CreateDirectoriesDto = z.infer<typeof createTagsSchema>;
