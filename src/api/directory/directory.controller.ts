import { Request, Response, NextFunction } from "express";
import DirectoryService from "../../modules/directory/directory.service";
import { CreateDirectoryDto } from "./dtos/request.dto";

class DirectoryController {
  constructor(private directoryService: DirectoryService) {}

  getUserDirectories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const directorites = await this.directoryService.getUserDirectories(
        req.user?.id
      );

      res.status(200).json(directorites);

      return;
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  createDirectory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const value = CreateDirectoryDto.validate(req.body);

      const directoryRequestData = {
        ...value,
        userId: req.user?.id,
      };
      const note = await this.directoryService.createDirectory(directoryRequestData);

      res.status(200).json(note);
      return;
    } catch (err) {
      console.log(err, " This is note error");
      next(err);
    }
  };

  getDirectory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const directoryId = req.params.directoryId as string;
      const getNote = req.query?.note;
      const note = await this.directoryService.getDirectoryNotes(directoryId);

      res.status(200).json(note);
      return;
    } catch (err) {
      next(err);
    }
  };
  deleteDirectory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {};
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
  //     const note = await this.directoryService.getNoteById(noteId);

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
  //     const notes = await this.directoryService.getAllNotes();

  //     res.status(200).json(notes);
  //     return;
  //   } catch (err) {
  //     next(err);
  //   }
  // };
}

export default DirectoryController;
