"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, json, printf, label, colorize } = winston_1.default.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
winston_1.default.addColors({
    error: "bold red",
    warn: "yellow",
    info: "green",
    debug: "blue",
});
exports.httpLogger = winston_1.default.createLogger({
    format: combine(
    // label(),
    timestamp({ format: timestampFormat }), colorize({ level: true, message: true }), printf(({ level, message, label, timestamp, ...data }) => `[${timestamp}] ${level} : ${message} stack:${JSON.stringify(
    //(${label})
    data)}`)),
    transports: [new winston_1.default.transports.Console()],
});
