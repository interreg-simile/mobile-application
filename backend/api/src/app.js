/**
 * @fileoverview Starting point of the server. It calls all the setup files to initialize the middlewares, the routes,
 * the internationalization, the database and finally the server itself.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import express from "express";

import startServer from "./setup/server";
import connectDb from "./setup/database";
import setupInternationalization from "./setup/i18n";
import setupMiddlewares from "./setup/middlewares";
import setupRoutes from "./setup/routes";
import { loadProjections } from "./utils/spatial";


// Create an express server
const server = express();

// Setup the middlewares
setupMiddlewares(server);

// ToDo Set up mail service

// Set up the crs projections
loadProjections();

// Setup the routes
setupRoutes(server);

// Setup the internationalization
setupInternationalization()
    // Connect to the database
    .then(() => connectDb())
    // Start the server
    .then(() => startServer(server))
    .catch(err => console.error(err));
