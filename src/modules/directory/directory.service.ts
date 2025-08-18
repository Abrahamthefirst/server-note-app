import DirectoryRepository from "../../repositories/directory.repository";
import { Note } from "../../generated/prisma";
interface CreateUserDirectoryType {
  userId: string;
  name: string;
}
class DirectoryService {
  constructor(private directoryRepository: DirectoryRepository) {}
  createDirectory = async (
    dto: CreateUserDirectoryType
  ): Promise<Note | null> => {
    try {
      const note = await this.directoryRepository.createDirectory(dto);
      return note;
    } catch (err) {
      throw err;
    }
  };

  getUserDirectories = async (userId: string) => {
    try {
      const directorites = await this.directoryRepository.getUserDirectories(
        userId
      );
      return directorites;
    } catch (err) {
      throw err;
    }
  };

  async getDirectoryNotes(id: string) {
    try {
      const directoryResponse =
        await this.directoryRepository.getDirectoryNotesByDirectoryId(id);
      return directoryResponse;
    } catch (err) {
      throw err;
    }
  }


  //    async getNoteById(id: string): Promise<Note | null> {
  //     try {
  //       const note = await this.directoryRepository.getNoteById(Number(id));
  //       return note;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  //   async getAllDirectories(): Promise<Note[] | null> {
  //     try {
  //       const notes = await this.directoryRepository.getAllNotes();
  //       return notes;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  //   async updateDirectory(note: Partial<Note>): Promise<Note | null> {
  //     try {
  //       const updatedNote = await this.directoryRepository.updateNoteById(note);
  //       return updatedNote;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  async deleteDirectory(id: string): Promise<{ id: string } | null> {
    try {
      const updatedNote = await this.directoryRepository.deleteDirectoryById(
        Number(id)
      );
      return { id: String(updatedNote?.id) };
    } catch (err) {
      throw err;
    }
  }
}

export default DirectoryService;
