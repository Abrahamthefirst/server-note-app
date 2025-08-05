import * as z from "zod/v4";
import { BadRequestError } from "../../../utils/error";

const CreateNoteSchema = z.strictObject({
  title: z.string("Please enter a valid username"),
  body: z.string("Input a password"),
  status: z.boolean("status field is required"),
  tagNames: z.array(z.string()).optional(),
});
export class CreateNoteRequestDTO {
  constructor() {}
  static validate = (data: any) => {
    const result = CreateNoteSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }

    const errMsg = result.error.issues.map((response) => {
      return response.message;
    });

    throw new BadRequestError(errMsg[0]);
  };
}

export class BasicLoginRequestDTO {
  constructor(public email: string, public password: string) {}

  static validate = (data: any) => {
    const Account = z
      .strictObject({
        email: z.email("Email is required"),
        password: z.string("Password is required"),
      })
      .required();

    const result = Account.safeParse(data);
    if (result.success) {
      return { error: null, value: result.data };
    }
 
    const errMsg = result.error.issues.map((response) => {
      return response.message;
    });

    return { value: null, errMsg };
  };
}
