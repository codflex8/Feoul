import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Unit } from "./Unit.model";
import { UnitIntresetStatus } from "../utils/validators/UnitValidator";

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
  @Column({
    type: "enum",
    enum: UnitIntresetStatus,
    default: UnitIntresetStatus.intreset,
  })
  status?: UnitIntresetStatus;

  @Column()
  reversePrice!: number;

  @Column()
  buyPrice!: number;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Unit, (unit) => unit.interests, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  unit!: Unit;
}
