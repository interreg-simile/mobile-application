import surveyRouter from "../modules/survey/survey.route";

/**
 * Sets up the endpoints of the API.
 *
 * @param {Object} server - The express server instance.
 */
export const setupRoutes = server => {

    console.info('SETUP - Routes...');

    server.use("/survey", surveyRouter);

};
