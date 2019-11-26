import path from "path";

import express from "express";
import swagger from "swagger-ui-express";
import yaml from "yamljs";

/**
 * Sets up the API docs using Swagger.
 *
 * @param {Object} server - The express server instance.
 */
export const setupDocs = server => {

    // ToDo temporary
    // Serve docs as static files
    server.use(express.static(path.join(__dirname, "..", "..", "docs")));

    // Load the yaml file containing the docs
    const docs = yaml.load(path.resolve("./docs/openapi.yaml"));

    // Serve the docs
    server.use("/api-docs", swagger.serve, swagger.setup(docs));

};
