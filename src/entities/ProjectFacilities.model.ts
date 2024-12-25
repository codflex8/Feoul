import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Project } from "./Project.model";

@Entity()
export class ProjectFacilities extends BaseModel {
  @Column()
  name!: string;

  @Column()
  lat!: number;

  @Column()
  lng!: number;

  @ManyToOne(() => Project, (project) => project.facilities, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project!: Project;
}
