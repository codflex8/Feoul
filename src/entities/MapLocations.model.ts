import { Column, Entity } from "typeorm";
import { BaseModel } from "./BaseModel";
import { MapLocationClassification } from "../utils/validators/MapLocation";

@Entity()
export class MapLocations extends BaseModel {
  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column()
  lat!: string;

  @Column()
  lng!: string;

  @Column({ type: "enum", enum: MapLocationClassification })
  classification!: MapLocationClassification;
}
