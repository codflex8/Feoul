import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { CommonStatus } from "../utils/types/enums";
import { Project } from "./Project.model";

@Entity()
export class ProjectTemplate extends BaseModel {
  @Column()
  name!: string;

  @Column()
  number!: number;

  // ToDo: check what is this link for
  @Column({ nullable: true })
  link?: string;

  @Column({ type: "enum", enum: CommonStatus, default: CommonStatus.archived })
  status!: CommonStatus;

  @ManyToOne(() => Project, (project) => project.templates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project!: Project;
}
