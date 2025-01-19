import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { Project } from "./Project.model";
import { UnitCategories } from "./UnitCategories.model";
import { UnitFloor } from "./UnitFloor.model";
import { UnitIntreset } from "./UnitIntreset.model";
import {
  UnitStatus,
  UnitTemplates,
  UnitTypes,
} from "../utils/validators/UnitValidator";
import { BaseNumberModel } from "./BaseNumberModel";

@Entity()
export class Unit extends BaseNumberModel {
  @Column({ nullable: true })
  name!: string;

  @Column()
  price!: number;

  @Column({ type: "enum", enum: UnitTypes })
  type!: UnitTypes;

  @Column({ type: "enum", enum: UnitTemplates })
  template!: UnitTemplates;

  @Column()
  buildStatus!: string;

  @Column({ nullable: true })
  buildLevel!: number;

  // {web,mobile,partners,third_party,ops_team}
  @Column({
    type: "simple-array",
    nullable: true,
  })
  salesChannels!: string[];

  @Column({
    type: "simple-array",
    nullable: true,
  })
  size!: number[];

  @Column({
    type: "simple-array",
    nullable: true,
  })
  position!: number[];

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

  @BeforeInsert()
  @BeforeUpdate()
  setUnitPropertiesBaseOnTemplate() {
    switch (this.template) {
      case UnitTemplates.lavender:
        this.bedroomNumber = 3;
        this.bathroomNumber = 4;
        break;
      default:
        this.bedroomNumber = 4;
        this.bathroomNumber = 5;
        break;
    }
  }
}
