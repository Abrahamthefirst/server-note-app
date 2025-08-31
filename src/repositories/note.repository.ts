import { Note } from "../generated/prisma";
import { PrismaClient } from "../generated/prisma";


interface CreateNoteRepositoryData {
  title: string;
  body: string;
  userId: string;
  status: boolean;
  directoryId?: string;
  tagNames?: string[];
}
class NoteRepo {
  constructor(private prisma: PrismaClient) {}
  async createNote(data: CreateNoteRepositoryData): Promise<Note> {
    try {
      const { title, body, userId, tagNames, status, directoryId } = data;

      const tagConnectOrCreateOperations =
        tagNames?.map((tagName) => ({
          where: { name: tagName },
          create: {
            name: tagName,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        })) || [];

      const newNote = await this.prisma.note.create({
        data: {
          title,
          body,
          status,
          user: {
            connect: {
              id: userId,
            },
          },
          folder: {
            connect: {
              id: directoryId,
            },
          },
          tags: {
            connectOrCreate: tagConnectOrCreateOperations,
          },
        },
        include: {
          tags: true,
        },
      });
      return newNote;
    } catch (err) {
      throw err;
    }
  }

  async getNotesByUserId(id: string): Promise<Note[] | null> {
    try {
      const notes = await this.prisma.note.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          title: true,
          body: true,
          status: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          directoryId: true,
          tags: {
            select: {
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
      return notes;
    } catch (err) {
      throw err;
    }
  }

  async getAllNotes(): Promise<Note[] | null> {
    try {
      const notes = await this.prisma.note.findMany();
      return notes;
    } catch (err) {
      throw err;
    }
  }
  async getNoteById(id: string): Promise<Note | null> {
    try {
      const note = await this.prisma.note.findUnique({
        where: {
          id,
        },
      });
      return note;
    } catch (err) {
      throw err;
    }
  }

  async updateNoteById(note: Partial<Note>): Promise<Note | null> {
    try {
      const { id, ...data } = note;
      const userData = await this.prisma.note.update({
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

  async deleteNoteById(id: string): Promise<Note | null> {
    try {
      const note = await this.prisma.note.delete({
        where: {
          id,
        },
      });

      return note;
    } catch (err) {
      throw err;
    }
  }
}

export default NoteRepo;

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
  error: K;
  message: string;
};

const name: Ghost = {
  data: {
    status: 300,
  },
  error: new Error("indome"),
  message: "Fast",
};
