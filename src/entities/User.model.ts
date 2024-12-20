import { Column, Entity, FindOptionsWhere } from "typeorm";
import { BaseModel } from "./BaseModel";

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum LanguageEnum {
  english = "en",
  arabic = "ar",
}
@Entity("users")
export class User extends BaseModel {
  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  phoneNumber!: string;

  @Column()
  username!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true })
  twitterId?: string;

  @Column({ type: "datetime", nullable: true })
  birthDate?: Date;

  @Column({ type: "enum", nullable: true, enum: GenderEnum })
  gender?: GenderEnum;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: "boolean", default: false })
  verifyEmail?: Boolean;

  @Column({ type: "int", nullable: true })
  verifyCode?: number;

  @Column({ type: "datetime", nullable: true })
  passwordChangedAt?: Date;

  @Column({ type: "int", nullable: true })
  passwordResetCode?: number;

  @Column({ type: "datetime", nullable: true })
  passwordResetExpires?: Date;

  @Column({ type: "boolean", default: false })
  passwordResetVerified?: Boolean;

  @Column({ type: "enum", nullable: true, enum: LanguageEnum })
  language?: LanguageEnum;

  static getPublicUserDataByEmail(query: FindOptionsWhere<User>) {
    return this.findOne({
      where: query,
      select: [
        "username",
        "email",
        "imageUrl",
        "gender",
        "birthDate",
        "gender",
        "id",
        "phoneNumber",
      ],
    });
  }
}
