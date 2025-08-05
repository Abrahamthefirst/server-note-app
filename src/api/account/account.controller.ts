import { Request, Response, NextFunction } from "express";
import AccountService from "../../modules/account/account.service";
class AccountController {
  constructor(private accountService: AccountService) {}
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {};
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const user = await this.accountService.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      }
    } catch (err) {
      next(err);
    }
  };
}

export default AccountController;
