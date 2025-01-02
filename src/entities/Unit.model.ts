import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Project } from "./Project.model";
import { UnitCategories } from "./UnitCategories.model";
import { UnitFloor } from "./UnitFloor.model";
import { UnitIntreset } from "./UnitIntreset.model";
import { UnitStatus, UnitTypes } from "../utils/validators/UnitValidator";
import { BaseNumberModel } from "./BaseNumberModel";

@Entity()
export class Unit extends BaseNumberModel {
  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column({ type: "enum", enum: UnitTypes })
  type!: UnitTypes;

  @Column()
  buildStatus!: string;

  @Column()
  buildLevel!: number;

  // {web,mobile,partners,third_party,ops_team}
  @Column({
    type: "simple-array",
    nullable: true,
  })
  salesChannels!: string[];

  // المساحة البيعية
  @Column()
  saledSpace!: number;

  @Column()
  landSpace!: number;

  @Column()
  buildSpace!: number;

  @Column({ enum: UnitStatus, nullable: true })
  status?: UnitStatus;

  @Column()
  bedroomNumber!: number;

  @Column()
  bathroomNumber!: number;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column()
  floorsNumber!: number;

  @Column({ nullable: true })
  advantages?: string;

  @ManyToOne(() => Project, (project) => project.units, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project!: Project;

  @ManyToOne(() => UnitCategories, (unitCategory) => unitCategory.units, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
  })
  category!: UnitCategories;

  @OneToMany(() => UnitFloor, (floor) => floor.unit, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  floors!: UnitFloor[];

  @OneToMany(() => UnitIntreset, (interest) => interest.unit, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  interests!: UnitIntreset[];
}
