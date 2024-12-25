import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Unit } from "./Unit.model";

@Entity()
export class UnitIntreset extends BaseModel {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  area!: string;

  @Column({ nullable: true })
  email?: string;
  // ToDo: check enum type
  @Column({ nullable: true })
  status?: string;

  @ManyToOne(() => Unit, (unit) => unit.interests, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  unit!: Unit;
}
