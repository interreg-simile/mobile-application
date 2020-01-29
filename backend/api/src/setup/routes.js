import { version } from "../middlewares/load-config";

import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/users/user.route";
import eventRouter from "../modules/events/events.route";
import alertsRouter from "../modules/alerts/alerts.route";
import obsRouter from "../modules/observations/observations.route";

import errorMiddleware from "../middlewares/error";


/**
 * Sets up the endpoints of the API.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    console.info('SETUP - Routes...');

    server.use(`/${version}/auth`, authRouter);
    server.use(`/${version}/users`, userRouter);
    server.use(`/${version}/events`, eventRouter);
    server.use(`/${version}/alerts`, alertsRouter);
    server.use(`/${version}/observations`, obsRouter);

    // Error handling middleware
    server.use(errorMiddleware);

};
