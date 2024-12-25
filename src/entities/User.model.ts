import { Column, Entity, FindOptionsWhere } from "typeorm";
import { BaseModel } from "./BaseModel";
import { UsersRoles } from "../utils/types/enums";

@Entity("users")
export class User extends BaseModel {
  @Column({ unique: true, nullable: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  phoneNumber!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: "enum", enum: UsersRoles })
  role!: UsersRoles;

  static getPublicUserDataByEmail(query: FindOptionsWhere<User>) {
    return this.findOne({
      where: query,
      select: ["username", "imageUrl", "id", "role"],
    });
  }
}
