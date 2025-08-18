import * as z from "zod/v4";
import { BadRequestError } from "../../../utils/error";

const createDirectorySchema = z.strictObject({
  name: z.string("Directory name is required").min(1).max(49),
});
export class CreateDirectoryDto {
  constructor(public name: string) {}

  static validate(data: z.infer<typeof createDirectorySchema>) {
    const {
      success,
      error,
      data: result,
    } = createDirectorySchema.safeParse(data);
    if (success) {
      return result;
    }

    const errMsgs = error.issues.map((response) => {
      return response.message;
    });

    throw new BadRequestError(errMsgs[0]);
  }
}
