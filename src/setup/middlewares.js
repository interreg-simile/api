/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import loadConfig from "../middlewares/load-config";
import checkToken from "../middlewares/check-token";
import upload from "../middlewares/upload";
import parseFormData from "../middlewares/parse-formdata";
import setLng from "../middlewares/set-lng";

/**
 * Sets up the necessary middlewares.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    console.info('SETUP - Middlewares...');

    server.use(cors());
    server.use(helmet());

    const accessLogStream = createStream("access.log", {
        interval: "1d",                                     // Rotate daily
        compress: true,                                     // Compress the rotated files
        path    : path.join(__dirname, "..", "..", "logs")  // Path to prepend to the files
    });
    server.use(morgan("combined", { stream: accessLogStream }));

    server.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));
    server.use(setLng);
    server.use(loadConfig);
    server.use(checkToken);
    server.use(upload);

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(parseFormData);

};
