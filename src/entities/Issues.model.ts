import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class Issues extends BaseModel {
  @Column()
  name!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  description!: string;
}
