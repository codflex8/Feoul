import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class MapLocations extends BaseModel {
  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ type: "float" })
  lat!: number;

  @Column({ type: "float" })
  lng!: number;
}
