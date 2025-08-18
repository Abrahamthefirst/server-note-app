import * as z from "zod/v4";
import { BadRequestError } from "../../../utils/error";
import { Role } from "../../../generated/prisma";
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  CountryCode,
} from "libphonenumber-js";

const RegistrationSchema = z.strictObject({
  username: z.string("Please enter a valid username").min(3).max(30),
  password: z
    .string("Input a password")
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    }),
  email: z.email("Please enter a valid email address."),
  phone_number: z.string("Please enter a valid phone number").optional(),
  country_code: z.string("").min(2).max(3).optional(),
  role: z
    .literal(["EDITOR", "VIEWER", "ADMIN"], { error: "No user role" })
    .optional(),
});

export class BasicRegistrationRequestDTO {
  constructor(
    public username: string,
    public password: string,
    public email: string,
    public role?: Role,
    public phone_number?: string,
    public country_code?: string
  ) {}
  static validate = (data: z.infer<typeof RegistrationSchema>) => {
    const result = RegistrationSchema.safeParse(data);
    let phoneNumber;
    if (data.phone_number) {
      phoneNumber = parsePhoneNumberFromString(
        data.phone_number,
        data.country_code?.toUpperCase() as CountryCode
      );
      const validPhoneNumber = isValidPhoneNumber(
        data.phone_number,
        data.country_code?.toUpperCase() as CountryCode
      );

      if (!phoneNumber || !validPhoneNumber) {
        throw new BadRequestError("Phone number or country code is invalid");
      }
    }


    if (result.success) {
      if (result.data && "country_code" in result.data) {
        delete result.data.country_code;
      }

      if (!result.data.phone_number) {
        delete result.data.phone_number;
      }
      return { ...result.data, phone_number: phoneNumber?.number };
    }

    const errMsgs = result.error.issues.map((response) => {
      return response.message;
    });

    throw new BadRequestError(errMsgs[0]);
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
      return result.data;
    }
    const errMsgs = result.error.issues.map((response) => {
      return response.message;
    });

    throw new BadRequestError(errMsgs[0]);
  };
}
