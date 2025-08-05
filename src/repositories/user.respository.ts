import { User } from "../generated/prisma";
import { Prisma } from "../generated/prisma";
import { ConflictError } from "../utils/error";
import { PrismaClient } from "@prisma/client";
class UserRepo {
  constructor(private prisma: PrismaClient) {}
  async createUser(
    data: Required<Pick<User, "email" | "username" | "role">> & Partial<User>
  ): Promise<User> {
    try {
      const userData = await this.prisma.user.create({
        data,
      });
      return userData;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new ConflictError("Email already exits, try logging in");
        }
      }
      throw err;
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async getUserByGoogleId(google_id: string): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          google_id,
        },
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUserById(user: Partial<User>): Promise<User | null> {
    try {
      const { id, ...data } = user;
      const userData = await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateUserByEmail(user: Partial<User>): Promise<User | null> {
    try {
      // handle if email not found
      const { email, ...data } = user;
      const userData = await this.prisma.user.update({
        where: {
          email,
        },
        data,
      });
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async deleteUserById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default UserRepo;

function getFirstElement<ArrayType>(array: ArrayType[]) {
  return array[0];
}

// generics is mainly used when you have a function that has some kind of data in it and you want that data to be changing it's type based on what you passed in or what you return
// const numbers = [1, 2, 3, 5];
// const firstNum = getFirstElement<number>(numbers);

// const strings = ["flash", "dog", "goat"];
// const firstString = getFirstElement(strings);

//we are going to use generics in the sense of if a generica type isn't passed in it will have a default value

type ApiResponse<Data extends { status: number } = { status: number }> = {
  data: Data;
  isError: boolean;
};

const myResponse: ApiResponse = {
  data: {
    status: 200,
  },
  isError: true,
};

// type Generic<T> = T extends ReadonlyArray<infer A> ? A: never
// const b = ["forlarin", "samuel", "jacob"] as const
// const a: Generic<["forlarin", "samuel", "jacob"]>
// const c: Generic<typeof b   >

type A = ReturnType<typeof fetch>;
type CustomReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

type keyValueSplitter<T extends string> = T extends `${infer K}:${infer V}`
  ? {
      key: K;
      value: V;
    }
  : never;
type F = keyValueSplitter<"name:kyle">;

type O = {
  name: string;
  age: number;
};

// looping in ts
type New<T> = {
  -readonly [P in Extract<keyof T, string | number> as `get${P}`]-?: T[P];
};
// Default values in Ts

type Ghost<
  Data extends { status: number } = { status: number },
  K extends Error = Error
> = {
  data: Data;
  error:K;
  message: string;
};

const name: Ghost = {
  data: {
    status: 300,
  },
  error: new Error("indome"),
  message: "Fast",
};
