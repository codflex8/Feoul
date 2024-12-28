"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = __importDefault(require("./data-source"));
const path_1 = __importDefault(require("path"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const cors_1 = __importDefault(require("cors"));
const ErrorMiddleware_1 = require("./middleware/ErrorMiddleware");
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
dotenv_1.default.config();
i18next_1.default
    .use(i18next_fs_backend_1.default) // Connects the file system backend
    .use(i18next_http_middleware_1.default.LanguageDetector) // Enables automatic language detection
    .init({
    backend: {
        loadPath: path_1.default.join(process.cwd(), "src/locales", "{{lng}}", "{{ns}}.json"), // Path to translation files
    },
    detection: {
        order: ["header"], // Detect language from HTTP headers
        caches: false, // Disable caching if you don't want cookies or query strings involved
    },
    fallbackLng: "en", // Default language when no language is detected
    preload: ["en", "ar"], // Preload these languages at startup
});
app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    logger_1.httpLogger.info("new request", {
        path: req.path,
        body: req.body,
        headers: req.headers,
        query: req.query,
    });
    next();
});
(0, routes_1.setRoutes)(app);
app.all("*", (req, res, next) => {
    next(new ApiError_1.default(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(ErrorMiddleware_1.globalError);
data_source_1.default.initialize()
    .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error);
});
process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at:", p, "reason:", reason);
});
