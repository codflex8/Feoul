import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "./entities/*.model.{js,ts}")],
  migrations: [path.join(__dirname, "./migrations/**/*.{js,ts}")],
  subscribers: [path.join(__dirname, "./subscribers/**/*.{js,ts}")],
});

export default AppDataSource;
