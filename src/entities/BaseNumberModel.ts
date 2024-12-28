import { Column } from "typeorm";
import { BaseModel } from "./BaseModel";

export class BaseNumberModel extends BaseModel {
  @Column()
  number!: number;

  static async getItemByNumber(number: number) {
    const item = await this.findOneBy({ number });
    return item;
  }
}
