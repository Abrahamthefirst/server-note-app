import NoteRepository from "../../repositories/note.repository";
import { Note } from "../../generated/prisma";
interface CreateNoteServiceData {
  title: string;
  body: string;
  tagNames?: string[];
  status: boolean
  userId: string;
}
class NoteService {
  constructor(private noteRepository: NoteRepository) {}
  createNote = async (dto: CreateNoteServiceData): Promise<Note | null> => {
    try {
      const note = await this.noteRepository.createNote(dto);
      return note;
    } catch (err) {
      throw err;
    }
  };
  async getNoteById(id: string): Promise<Note | null> {
    try {
      const note = await this.noteRepository.getNoteById(Number(id));
      return note;
    } catch (err) {
      throw err;
    }
  }

  async getUserNotes(id: string): Promise<Note[] | null> {
    try {
      const notes = await this.noteRepository.getNotesByUserId(id);
      return notes;
    } catch (err) {
      throw err;
    }
  }
  async getAllNotes(): Promise<Note[] | null> {
    try {
      const notes = await this.noteRepository.getAllNotes();
      return notes;
    } catch (err) {
      throw err;
    }
  }

  async updateNote(note: Partial<Note>): Promise<Note | null> {
    try {
      const updatedNote = await this.noteRepository.updateNoteById(note);
      return updatedNote;
    } catch (err) {
      throw err;
    }
  }

  async deleteNote(id: string): Promise<{ id: string } | null> {
    try {
      const updatedNote = await this.noteRepository.deleteNoteById(Number(id));
      return { id: String(updatedNote?.id) };
    } catch (err) {
      throw err;
    }
  }
}

export default NoteService;
