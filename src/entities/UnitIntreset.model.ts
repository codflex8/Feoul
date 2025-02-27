import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Unit } from "./Unit.model";
import {
  UnitIntresetStatus,
  UnitIntresertSupport,
} from "../utils/validators/UnitValidator";

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

  @Column({ nullable: true })
  reversePrice!: number;

  @Column({ nullable: true })
  buyPrice!: number;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Unit, (unit) => unit.interests, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  unit!: Unit;

  @Column({ type: "enum", enum: UnitIntresertSupport, nullable: true })
  support?: UnitIntresertSupport;
}
