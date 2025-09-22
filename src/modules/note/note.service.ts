import NoteRepository from "../../repositories/note.repository";
interface CreateNoteServiceData {
  title: string;
  body: string;
  tagNames?: string[];
  directoryId?: string
  status: boolean
  userId: string;
}
class NoteService {
  constructor(private noteRepository: NoteRepository) {}
  createNote = async (dto: CreateNoteServiceData)  => {
    try {
      const note = await this.noteRepository.createNote(dto);
      return note;
    } catch (err) {
      throw err;
    }
  };
  async getNoteById(id: string) {
    try {
      const note = await this.noteRepository.getNoteById(id);
      return note;
    } catch (err) {
      throw err;
    }
  }

  async getUserNotes(id: string) {
    try {
      const notes = await this.noteRepository.getNotesByUserId(id);
      return notes;
    } catch (err) {
      throw err;
    }
  }
  async getAllNotes() {
    try {
      const notes = await this.noteRepository.getAllNotes();
      return notes;
    } catch (err) {
      throw err;
    }
  }

  async updateNote(note: Partial<CreateNoteServiceData>){
    try {
      const updatedNote = await this.noteRepository.updateNoteById(note);
      return updatedNote;
    } catch (err) {
      throw err;
    }
  }

  async deleteNote(id: string) {
    try {

      const deletedNote = await this.noteRepository.deleteNoteById(id);
      return { id: String(deletedNote?.id) };
    } catch (err) {
      throw err;
    }
  }
}

export default NoteService;
