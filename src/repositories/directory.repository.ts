import { Note, Directory } from "../generated/prisma";
import { ConflictError } from "../utils/error";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "../generated/prisma";
interface CreateNoteRepositoryData {
  name: string;
}
interface DirectoryResponse {
  name: string;
  notes: Note[];
}
class DirectoryRepository {
  constructor(private prisma: PrismaClient) {}
  async createDirectory(data: CreateNoteRepositoryData): Promise<Note> {
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
  async getUserDirectories(userId: string): Promise<Directory> {
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
      const notes = await this.prisma.directory.findMany({
        where: {
          id,
        },
        include: {
          notes: true,
        },
      });
      return notes;
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
      currentParentId = parent?.parentId || null;
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

  async deleteDirectoryById(id: number): Promise<Note | null> {
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
  async getAllDirectories(): Promise<Note[] | null> {
    try {
      const notes = await this.prisma.note.findMany();
      return notes;
    } catch (err) {
      throw err;
    }
  }
  async getDirectoryById(id: number): Promise<Note | null> {
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
}

export default DirectoryRepository;
