import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Unit } from "./Unit.model";
import { CommonStatus } from "../utils/types/enums";
import { ProjectTemplate } from "./ProjectTemplate.model";
import { ProjectFacilities } from "./ProjectFacilities.model";
import { BaseNumberModel } from "./BaseNumberModel";

@Entity()
export class Project extends BaseNumberModel {
  @Column()
  name!: string;

  @Column({ type: "enum", enum: CommonStatus, default: CommonStatus.posted })
  status!: CommonStatus;

  @Column({ nullable: true })
  projectDocUrl?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ type: "float" })
  lng!: number;

  @Column({ type: "float" })
  lat!: number;

  @OneToMany(() => Unit, (unit) => unit.project, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  units!: Unit[];

  @ManyToOne(() => ProjectTemplate, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
  })
  template!: ProjectTemplate;

  @OneToMany(() => ProjectFacilities, (fac) => fac.project, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  facilities!: ProjectFacilities[];

  static async getProjectByNumber(number: number) {
    const project = await this.findOneBy({ number });
    return project;
  }
}
