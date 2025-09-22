import UserRepository from "../../repositories/user.respository";
import { User } from "@prisma/client";
class AccountService {
  constructor(
    private userRepository: UserRepository,
  ) {}
  async getUserById(id: string) {
    try {
      const user = await this.userRepository.getUserById(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(id: string) {
    try {
      const user = await this.userRepository.getUserById(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(user: Partial<User>) {
    try {
      const updatedUser = await this.userRepository.updateUserById(user);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      const updatedUser = await this.userRepository.deleteUserById(id);
      return { id: String(updatedUser?.id) };
    } catch (err) {
      throw err;
    }
  }
}

export default AccountService;
