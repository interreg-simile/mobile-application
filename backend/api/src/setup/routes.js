import path from "path";
import yaml from "yamljs";

import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/users/user.route";
import surveyRouter from "../modules/surveys/surveys.route";
import eventRouter from "../modules/events/events.route";
import alertsRouter from "../modules/alerts/alerts.route";

import errorMiddleware from "../middlewares/error";


/** Configuration in JSON format. */
const conf = yaml.load(path.resolve("./src/config/default.yaml"));


/** Version of the API in the format v1. */
export const version = `v${conf.app.version}`;


/**
 * Sets up the endpoints of the API.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    console.info('SETUP - Routes...');

    console.log(`/${version}/alerts`);

    server.use(`/${version}/auth`, authRouter);
    server.use(`/${version}/users`, userRouter);
    server.use(`/${version}/surveys`, surveyRouter);
    server.use(`/${version}/events`, eventRouter);
    server.use(`/${version}/alerts`, alertsRouter);

    // Error handling middleware
    server.use(errorMiddleware);

};
