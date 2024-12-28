import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { CommonStatus } from "../utils/types/enums";
import { Project } from "./Project.model";
import { BaseNumberModel } from "./BaseNumberModel";

@Entity()
export class ProjectTemplate extends BaseNumberModel {
  @Column()
  name!: string;

  // ToDo: check what is this link for
  @Column({ nullable: true })
  link?: string;

  @Column({ type: "enum", enum: CommonStatus, default: CommonStatus.archived })
  status!: CommonStatus;

  @OneToMany(() => Project, (proj) => proj.template, {
    // cascade: true,
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
  })
  projects!: Project[];
}
