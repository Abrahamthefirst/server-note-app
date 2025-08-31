import TagRepository from "../../repositories/tag.repository";
import { Tag } from "../../generated/prisma";

class TagService {
  constructor(private tagRespository: TagRepository) {}
  createTags = async (dto: string[], userId: string): Promise<Tag[] | null> => {
    try {
      const tag = await this.tagRespository.createTag(dto, userId);
      return tag;
    } catch (err) {
      throw err;
    }
  };

  getUserTags = async (userId: string) => {
    try {
      const tags = await this.tagRespository.getUserTags(userId);
      return tags;
    } catch (err) {
      throw err;
    }
  };

  //    async getNoteById(id: string): Promise<Directory | null> {
  //     try {
  //       const note = await this.tagRespository.getNoteById(Number(id));
  //       return note;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  //   async getAllDirectories(): Promise<Directory[] | null> {
  //     try {
  //       const notes = await this.tagRespository.getAllNotes();
  //       return notes;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  //   async updateDirectory(note: Partial<Note>): Promise<Note | null> {
  //     try {
  //       const updatedNote = await this.tagRespository.updateNoteById(note);
  //       return updatedNote;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  async deleteTagById(id: string): Promise<{ id: string } | null> {
    try {
      const deletedNote = await this.tagRespository.deleteTagById(id);
      return { id: String(deletedNote?.id) };
    } catch (err) {
      throw err;
    }
  }
}

export default TagService;
