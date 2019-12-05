import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import setupDocs from "./docs";
import loadConfig from "../middlewares/load-config";
import checkKey from "../middlewares/check-key";
import checkToken from "../middlewares/check-token";
import upload from "../middlewares/upload";
import parseFormData from "../middlewares/parse-formdata";


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

    // Use morgan for request logging
    // const accessLogStream = fs.createWriteStream(path.join(__dirname, "src/logs/server.log"), { flags: "a" });
    // server.use(morgan("combined", { stream: accessLogStream }));

    // Setup the docs
    setupDocs(server);

    // Setup the static path to the images
    server.use(express.static(path.join(__dirname, "..", "..", "uploads")));

    // Load the route configuration
    server.use(loadConfig);

    // Upload any possible file
    server.use(upload);

    // Parse the requests
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(parseFormData);

    // Check the API key
    server.use(checkKey);

    // Check the authorization token
    server.use(checkToken);

};
