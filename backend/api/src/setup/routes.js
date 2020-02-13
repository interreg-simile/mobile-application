/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import { version } from "../middlewares/load-config";

import authRouter from "../modules/auth/auth.route";
import usersRouter from "../modules/users/user.route";
import roisRouter from "../modules/rois/rois.route";
import eventsRouter from "../modules/events/events.route";
import alertsRouter from "../modules/alerts/alerts.route";
import obsRouter from "../modules/observations/observations.route";
import miscRouter from "../modules/misc/misc.route";

import errorMiddleware from "../middlewares/error";


/**
 * Sets up the endpoints of the API.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    console.info('SETUP - Routes...');

    // Set up the routes
    server.use(`/${version}/auth`, authRouter);
    server.use(`/${version}/users`, usersRouter);
    server.use(`/${version}/rois`, roisRouter);
    server.use(`/${version}/events`, eventsRouter);
    server.use(`/${version}/alerts`, alertsRouter);
    server.use(`/${version}/observations`, obsRouter);
    server.use(`/${version}/misc`, miscRouter);

    // Error handling middleware
    server.use(errorMiddleware);

};
