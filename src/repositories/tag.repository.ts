import { ConflictError } from "../utils/error";
import { PrismaClient, Tag, Prisma} from "@prisma/client";

class TagRepository {
  constructor(private prisma: PrismaClient) {}
  async createTag(data: string[], userId: string): Promise<Tag[]> {
    try {
      const tagData = data.map((tagName) => ({
        name: tagName,
        userId: userId,
      }));
      const newTags = await this.prisma.tag.createManyAndReturn({
        data: tagData,
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
  async getUserTags(userId: string): Promise<Tag[]> {
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

  async updateTagById(tagId: number, data: Partial<Tag>): Promise<Tag | null> {
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

  async deleteTagById(id: number): Promise<Tag | null> {
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

}

export default TagRepository;
