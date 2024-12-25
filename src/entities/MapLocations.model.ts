import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class MapLocations extends BaseModel {
  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column()
  lat!: number;

  @Column()
  lng!: number;
}
