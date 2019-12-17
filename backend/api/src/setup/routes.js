import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/users/user.route";
import surveyRouter from "../modules/surveys/surveys.route";
import eventRouter from "../modules/events/events.route";
import alertsRouter from "../modules/alerts/alerts.route";

import errorMiddleware from "../middlewares/error";


/**
 * Sets up the endpoints of the API.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    console.info('SETUP - Routes...');

    server.use("/auth", authRouter);
    server.use("/users", userRouter);
    server.use("/surveys", surveyRouter);
    server.use("/events", eventRouter);
    server.use("/alerts", alertsRouter);

    // Error handling middleware
    server.use(errorMiddleware);

};
