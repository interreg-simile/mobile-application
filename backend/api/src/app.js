import express from "express";

import startServer from "./setup/server";
import connectDb from "./setup/database";
import setupInternationalization from "./setup/i18n";
import setupMiddlewares from "./setup/middlewares";
import setupRoutes from "./setup/routes";


// Create an express server
const server = express();

// Setup the middlewares
setupMiddlewares(server);

// Setup the routes
setupRoutes(server);

// Setup the internationalization
setupInternationalization()
    // Connect to the database
    .then(() => connectDb())
    // Start the server
    .then(() => startServer(server))
    .catch(err => console.error(err));
