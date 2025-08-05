import UserRepository from "../../repositories/user.respository";
import { User } from "../../generated/prisma";
class AccountService {
  constructor(
    private userRepository: UserRepository,
  ) {}
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.getUserById(Number(id));
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.getUserById(Number(id));
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(user: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.userRepository.updateUserById(user);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string): Promise<{ id: string } | null> {
    try {
      const updatedUser = await this.userRepository.deleteUserById(Number(id));
      return { id: String(updatedUser?.id) };
    } catch (err) {
      throw err;
    }
  }
}

export default AccountService;
