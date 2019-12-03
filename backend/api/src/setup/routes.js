import authRouter from "../modules/auth/auth.route";
import userRouter from "../modules/user/user.route";
import surveyRouter from "../modules/survey/survey.route";
import eventRouter from "../modules/event/event.route";
import errorMiddleware from "../middlewares/error";


/**
 * Sets up the endpoints of the API.
 *
 * @param {Object} server - The express server instance.
 */
export default function (server) {

    console.info('SETUP - Routes...');

    server.use("/auth", authRouter);
    server.use("/user", userRouter);
    server.use("/survey", surveyRouter);
    server.use("/event", eventRouter);

    // Error handling middleware
    server.use(errorMiddleware);

};
