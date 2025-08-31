import { Tag } from "../generated/prisma";
import { ConflictError } from "../utils/error";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "../generated/prisma";

class TagRepository {
  constructor(private prisma: PrismaClient) {}
  async createTag(data: string[], userId: string): Promise<Tag[]> {
    try {
      const newTags = await this.prisma.tag.createManyAndReturn({
        data,
        where: {
          id: userId,
        },
      });
      return newTags;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err?.code === "P2002") {
          throw new ConflictError("Tag name already exist ");
        }
      }
      throw err;
    }
  }
  async getUserTags(userId: string): Promise<Tag> {
    try {
      const tags = await this.prisma.tag.findMany({
        where: {
          userId,
        },
      });
      return tags;
    } catch (err) {
      throw err;
    }
  }

  async updateTagById(tagId: string, data: Partial<Tag>): Promise<Tag | null> {
    try {
      const updatedTag = await this.prisma.tag.update({
        where: {
          id: tagId,
        },
        data,
      });
      return updatedTag;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteTagById(id: string): Promise<Tag | null> {
    try {
      const tag = await this.prisma.tag.delete({
        where: { id },
      });

      return tag;
    } catch (err) {
      console.log(err, "This might be the error");
      throw err;
    }
  }
  async getAllDirectories(): Promise<Tag[] | null> {
    try {
      const notes = await this.prisma.note.findMany();
      return notes;
    } catch (err) {
      throw err;
    }
  }
  async getDirectoryById(id: number): Promise<Tag | null> {
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

export default TagRepository;
