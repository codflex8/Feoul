import { MigrationInterface, QueryRunner } from "typeorm";
import { MapLocations } from "../entities/MapLocations.model";
import { MapLocationClassification } from "../utils/validators/MapLocation";

export class AddDefaultValuesToMapLocation1736975558600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const basicLandmarks = [
      {
        name: "مطار الملك عبدالعزيز الدولي",
        type: "airport",
        position: [21.681865, 39.166439],
      },
      {
        name: "مسجد الرحمة ",
        type: "mosque",
        position: [21.597301, 39.133099],
      },
      {
        name: "المول السعودي الألماني جدة",
        type: "park",
        position: [21.5452, 39.1331],
      },
      {
        name: "الجامعة السعودي الألماني جدة",
        type: "educate",
        position: [21.6, 39.2],
      },
      {
        name: "المنتزه السعودي الألماني جدة",
        type: "mall",
        position: [21.577301, 39.25],
      },
      {
        name: "المنتزه السعودي الألماني جدة",
        type: "sport",
        position: [21.571101, 39.19],
      },
    ];

    const landmarks = [
      {
        name: "مركز بحور التعليمي",
        type: "educate",
        position: [21.68185, 39.16642],
      },
      {
        name: "مركز بحور الصحي",
        type: "health",
        position: [21.59732, 39.1331],
      },
      { name: "مول العرب", type: "mall", position: [21.5457, 39.1335] },
      { name: "مول الهلال", type: "mall", position: [21.65, 39.28] },
      {
        name: "مركز البلال الصحي",
        type: "health",
        position: [21.577315, 39.2512],
      },
      {
        name: "مركز جدة التعليمي",
        type: "educate",
        position: [21.571108, 39.1925],
      },
      {
        name: "مركز بحور التعليمي",
        type: "educate",
        position: [21.68285, 39.16242],
      },
      {
        name: "مركز بحور الصحي",
        type: "health",
        position: [21.52732, 39.1231],
      },
      { name: "مول العرب", type: "mall", position: [21.5757, 39.1535] },
      { name: "مول الهلال", type: "mall", position: [21.655, 39.25] },
      {
        name: "مركز البلال الصحي",
        type: "health",
        position: [21.579315, 39.2592],
      },
      {
        name: "مركز جدة التعليمي",
        type: "educate",
        position: [21.571128, 39.2925],
      },
    ];

    // Combine and map the landmarks
    const combinedLandmarks = [...basicLandmarks, ...landmarks].map(
      (landmark) => {
        const [lat, lng] = landmark.position;
        return MapLocations.create({
          name: landmark.name,
          type: landmark.type,
          lat: lat.toString(),
          lng: lng.toString(),
          classification: basicLandmarks.includes(landmark)
            ? MapLocationClassification.primary
            : MapLocationClassification.secondary,
        });
      }
    );

    // Save all landmarks to the database
    await MapLocations.save(combinedLandmarks);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Optionally, delete the records inserted in the `up` method
    await queryRunner.query(`DELETE FROM map_locations`);
  }
}
