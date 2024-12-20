import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { setRoutes } from "./routes/index";
import AppDataSource from "./data-source";
import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import cors from "cors";
import { globalError } from "./middleware/ErrorMiddleware";
import ApiError from "./utils/ApiError";
import dotenv from "dotenv";
import { httpLogger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
dotenv.config();
i18next
  .use(Backend) // Connects the file system backend
  .use(middleware.LanguageDetector) // Enables automatic language detection
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locales",
        "{{lng}}",
        "{{ns}}.json"
      ), // Path to translation files
    },
    detection: {
      order: ["header"], // Detect language from HTTP headers
      caches: false, // Disable caching if you don't want cookies or query strings involved
    },
    fallbackLng: "en", // Default language when no language is detected
    preload: ["en", "ar"], // Preload these languages at startup
  });
app.use(middleware.handle(i18next));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  httpLogger.info("new request", {
    path: req.path,
    body: req.body,
    headers: req.headers,
    query: req.query,
  });

  next();
});
setRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
