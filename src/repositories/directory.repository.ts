import { ConflictError } from "../utils/error";
import { PrismaClient, Directory, Prisma, Note } from "@prisma/client";
interface CreateDirectoryRepositoryData {
  name: string;
}
interface DirectoryResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  parentId: string | null;
  notes: Note[];
}
class DirectoryRepository {
  constructor(private prisma: PrismaClient) {}
  async createDirectory(
    data: CreateDirectoryRepositoryData
  ): Promise<Directory> {
    try {
      const newDirectory = await this.prisma.directory.create({
        data,
      });
      return newDirectory;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err?.code === "P2002") {
          throw new ConflictError("Directory name already exist ");
        }
      }
      throw err;
    }
  }
  async getUserDirectories(userId: string): Promise<Directory[]> {
    try {
      const directorites = await this.prisma.directory.findMany({
        where: {
          userId,
        },
      });
      return directorites;
    } catch (err) {
      throw err;
    }
  }

  async getDirectoryNotesByDirectoryId(
    id: string
  ): Promise<DirectoryResponse | null> {
    try {
      const directory = await this.prisma.directory.findUnique({
        where: {
          id,
        },
        include: {
          notes: true,
        },
      });
      return directory;
    } catch (err) {
      throw err;
    }
  }

  // Come back to understand and rewrite this circular references
  async hasCircularReference(
    potentialChildId: string,
    potentialParentId: string
  ): Promise<boolean> {
    let currentParentId = potentialParentId;

    while (currentParentId !== null) {
      if (currentParentId === potentialChildId) {
        return true; // A circular reference is found
      }
      const parent = await this.prisma.directory.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });
      currentParentId = parent?.parentId || null as unknown as string
    }
    return false;
  }

  async updateDirectoryById(
    directoryId: string,
    noteIds: string[]
  ): Promise<Directory | null> {
    try {
      const updatedDirectory = await this.prisma.directory.update({
        where: {
          id: directoryId,
        },
        data: {
          notes: {
            connect: noteIds.map((id) => ({ id })),
          },
        },
        include: {
          notes: true,
        },
      });
      return updatedDirectory;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteDirectoryById(id: string): Promise<Directory | null> {
    try {
      console.log(id, "This is the id");
      const transaction = await this.prisma.$transaction(async () => {
        await this.prisma.note.deleteMany({
          where: { directoryId: id },
        });

        const directory = await this.prisma.directory.delete({
          where: { id: id },
        });
        return directory;
      });

      return transaction;
    } catch (err) {
      console.log(err, "This might be the error");
      throw err;
    }
  }
  async getAllDirectories(): Promise<Directory[] | null> {
    try {
      const notes = await this.prisma.directory.findMany();
      return notes;
    } catch (err) {
      throw err;
    }
  }
  async getDirectoryById(id: string): Promise<Directory | null> {
    try {
      const note = await this.prisma.directory.findUnique({
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

export default DirectoryRepository;
