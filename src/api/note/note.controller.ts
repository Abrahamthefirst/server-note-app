import { Request, Response, NextFunction } from "express";
import NoteService from "../../modules/note/note.service";
import { CreateNoteRequestDTO } from "./dtos/request.dto";

class NoteController {
  constructor(private noteService: NoteService) {}

  getAuthUserNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const notes = await this.noteService.getUserNotes(req.user?.id);

      res.status(200).json(notes);

      return;
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("carry goat", req.user?.id);

      const value = CreateNoteRequestDTO.validate(req.body);

      const noteToCreate = {
        ...value,
        userId: req.user?.id,
      };
      const note = await this.noteService.createNote(noteToCreate);

      res.status(200).json(note);
      return;
    } catch (err) {
      console.log(err, " This is note error");
      next(err);
    }
  };
  getNoteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const noteId = req.params.id;
      const note = await this.noteService.getNoteById(noteId);

      res.status(200).json(note);
      return;
    } catch (err) {
      next(err);
    }
  };

  getAllNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const notes = await this.noteService.getAllNotes();

      res.status(200).json(notes);
      return;
    } catch (err) {
      next(err);
    }
  };
  deleteNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {};
  updateNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {};
}

export default NoteController;
