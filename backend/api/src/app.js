import express from "express";

import { start } from "./config/server";
import { connect, onError } from "./config/database";

// Create an express server
const server = express();

// Connect to the database and start the server
connect()
    .then(() => start(server))
    .catch(err => onError(err));
