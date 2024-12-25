import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Unit } from "./Unit.model";

@Entity()
export class UnitFloor extends BaseModel {
  @Column()
  name!: string;

  @Column()
  index!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Unit, (unit) => unit.floors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  unit!: Unit;
}
