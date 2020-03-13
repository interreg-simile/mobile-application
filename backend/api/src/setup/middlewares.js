/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import loadConfig from "../middlewares/load-config";
import checkKey from "../middlewares/check-key";
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

    // Set headers for CORS
    server.use(cors());

    // Use helmet to set secure response headers
    server.use(helmet());

    // Create the rotating logging access stream
    const accessLogStream = createStream("access.log", {
        interval: "1d",                                     // Rotate daily
        compress: true,                                     // Compress the rotated files
        path    : path.join(__dirname, "..", "..", "logs")  // Path to prepend to the files
    });

    // Use morgan to log
    server.use(morgan("combined", { stream: accessLogStream }));

    // Setup the static path to the images
    server.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));

    // Set the responses language
    server.use(setLng);

    // Load the route configuration
    server.use(loadConfig);

    // Check the API key
    server.use(checkKey);

    // Check the authorization token
    server.use(checkToken);

    // Upload any possible file
    server.use(upload);

    // Parse the requests
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(parseFormData);

};
