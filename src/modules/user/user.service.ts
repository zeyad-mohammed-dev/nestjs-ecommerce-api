import { UserDocument } from "src/DB";
import { UserRepository } from "./../../DB/repository/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async allUsers(): Promise<UserDocument[]> {
    const users = (await this.userRepository.find({
      filter: {},
    })) as unknown as UserDocument[];
    return users;
  }
}
