import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Project } from "./Project.model";

@Entity()
export class ProjectFacilities extends BaseModel {
  @Column()
  name!: string;

  @Column({ type: "float" })
  lat!: number;

  @Column({ type: "float" })
  lng!: number;

  @ManyToOne(() => Project, (project) => project.facilities, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project!: Project;
}
