/**
 * @fileoverview This file sets up the API documentation using Swagger. The documentation is work in progress, so the
 * implementation in this file is just temporary.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import path from "path";
import express from "express";
import swagger from "swagger-ui-express";
import yaml from "yamljs";


/**
 * Sets up the API docs using Swagger.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    // Serve docs as static files
    server.use(express.static(path.join(__dirname, "..", "..", "docs")));

    // Load the yaml file containing the docs
    const docs = yaml.load(path.resolve("./docs/openapi.yaml"));

    // Serve the docs
    server.use("/api-docs", swagger.serve, swagger.setup(docs));

};
