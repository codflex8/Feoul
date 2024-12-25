import { Entity, Column, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { CommonStatus } from "../utils/types/enums";
import { Unit } from "./Unit.model";

@Entity()
export class UnitCategories extends BaseModel {
  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column()
  number!: number;

  @Column({ type: "enum", enum: CommonStatus, default: CommonStatus.archived })
  status!: CommonStatus;

  @OneToMany(() => Unit, (unit) => unit.category, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
  })
  units!: Unit[];
}
