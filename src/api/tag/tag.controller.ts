import { Request, Response, NextFunction } from "express";
import { CreateTagDto } from "./dtos/request.dto";
import TagService from "../../modules/tag/tag.service";

class TagController {
  constructor(private tagService: TagService) {}

  getUserTags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tags = await this.tagService.getUserTags(req.user?.id);

      res.status(200).json(tags);

      return;
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = CreateTagDto.validate(req.body);
      const userId = req.user?.id;

      const note = await this.tagService.createTags(value, userId);

      res.status(200).json(note);
      return;
    } catch (err) {
      next(err);
    }
  };
  deleteTagById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const directoryId = req.params.id as string;
      const note = await this.tagService.deleteTagById(directoryId);
      res.status(200).json(note);
      return;
    } catch (err) {
      next(err);
    }
  };
  // getTag = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const directoryId = req.params.directoryId as string;
  //     const getNote = req.query?.note;
  //     const note = await this.tagService.getDirectoryNotes(directoryId);

  //     res.status(200).json(note);
  //     return;
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  updateNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {};
  //  getDirectoryById = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const noteId = req.params.id;
  //     const note = await this.tagService.getNoteById(noteId);

  //     res.status(200).json(note);
  //     return;
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  // getAllDirectories = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const notes = await this.tagService.getAllNotes();

  //     res.status(200).json(notes);
  //     return;
  //   } catch (err) {
  //     next(err);
  //   }
  // };
}

export default TagController;
