import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Unit } from "./Unit.model";
import { CommonStatus } from "../utils/types/enums";
import { ProjectTemplate } from "./ProjectTemplate.model";
import { ProjectFacilities } from "./ProjectFacilities.model";

@Entity()
export class Project extends BaseModel {
  @Column()
  name!: string;

  @Column()
  number!: number;

  @Column({ type: "enum", enum: CommonStatus, default: CommonStatus.archived })
  status!: CommonStatus;

  @Column({ nullable: true })
  projectDocUrl?: string;

  @Column({ nullable: true })
  city?: string;

  @Column()
  lng!: number;

  @Column()
  lat!: number;

  @OneToMany(() => Unit, (unit) => unit.project, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  units!: Unit[];

  @OneToMany(() => ProjectTemplate, (template) => template.project, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  templates!: ProjectTemplate[];

  @OneToMany(() => ProjectFacilities, (fac) => fac.project, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  facilities!: ProjectFacilities[];
}
