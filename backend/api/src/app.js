import express from "express";

import { startServer } from "./setup/server";
import { connectDb, onDbConnectionError } from "./setup/database";
import { setupMiddlewares } from "./setup/middlewares";
import { setupRoutes } from "./setup/routes";
import errorMiddleware from "./middlewares/error";

import swagger from "swagger-ui-express";
import path from "path";

const YAML = require("yamljs");


const docs = YAML.load(path.resolve("./docs/openapi.yaml"));

// Create an express server
const server = express();

server.use("/api-docs", swagger.serve, swagger.setup(docs));

// Setup the middlewares
setupMiddlewares(server);

// Setup the routes
setupRoutes(server);

// Error handling middleware
server.use(errorMiddleware);

// Connect to the database and start the server
connectDb()
    .then(() => startServer(server))
    .catch(err => onDbConnectionError(err));
