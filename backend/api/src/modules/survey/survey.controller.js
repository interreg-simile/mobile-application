import Survey from "./survey.model";
import User from "../user/user.model";
import { checkIfAuthorized, checkValidation } from "../../utils/common-checks";
import { constructError } from "../../utils/construct-error";


/**
 * Returns all the surveys saved in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getAll = (req, res, next) => {

    // Retrieve the query parameters
    const includeExpired      = req.query.includeExpired || "true",
          includeDeleted      = req.query.includeDeleted || "false",
          includeUsersAnswers = req.query.includeUsersAnswers || "false";

    // Set the parameters for the mongo query
    let filter     = {};
    let projection = {};

    // Exclude the survey marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // If the request does not come from an admin, throw an error
    else if (includeDeleted === "true" && !req.isAdmin) {
        next(constructError(401, "You are not authorized to set query parameter includeDeleted to true."));
        return;
    }

    // Take the surveys with expireDate greater or equal to the current date
    if (includeExpired === "false") filter.expireDate = { $gte: new Date() };

    // Exclude the answers
    if (includeUsersAnswers === "false") projection.usersAnswers = 0;

    // Exclude the idValidation of the user who has answered and the answer date
    if (includeUsersAnswers === "true" && !req.isAdmin) {
        projection["usersAnswers.uid"]  = 0;
        projection["usersAnswers.date"] = 0;
    }

    // Find the data
    Survey.find(filter, projection)
        .then(surveys => res.status(200).json({ meta: { code: 200 }, data: { surveys } }))
        .catch(err => next(err));

};


/**
 * Returns the surveys done or not done by a given user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getByUser = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Extract the user id from the request path
    const userId = req.params.id;

    // If the request does not come from an admin and the user is requesting the data of another user, throw an error
    if (!checkIfAuthorized(req, next, userId)) return;

    // Extract the query parameters
    const includeExpired = req.query.includeExpired || "true",
          includeDeleted = req.query.includeDeleted || "false",
          invert         = req.query.invert || "false";

    // Find the user
    User.findById(userId)
        .then(user => {

            // If the user does not exist, throw an error
            if (!user) {
                next(constructError(404, "User not found."));
                return;
            }

            // Set the parameters for the mongo query
            let filter     = {};
            let projection = {};

            // Exclude the survey marked for deletion
            if (includeDeleted === "false") filter.markedForDeletion = false;

            // If the request does not come from an admin, throw an error
            else if (includeDeleted === "true" && !req.isAdmin) {
                next(constructError(401, "You are not authorized to set query parameter includeDeleted to true."));
                return;
            }

            // Take only the surveys done by the user
            if (invert === "false") filter["usersAnswers.uid"] = userId;

            else {

                // Take only the surveys not done by the user
                filter["usersAnswers.uid"] = { $ne: userId };

                // Don't return any answer
                projection.usersAnswers = 0;

            }

            // Take the surveys with expireDate greater or equal to the current date
            if (includeExpired === "false") filter.expireDate = { $gte: new Date() };

            // Find the data
            return Survey.find(filter, projection);

        })
        .then(surveys => {

            // return only the answers of the user
            if (invert === "false") {
                for (const survey of surveys)
                    survey.usersAnswers = survey.usersAnswers.filter(e => e.uid.toString() === userId)
            }

            res.status(200).json({ meta: { code: 200 }, data: { surveys } });

        })
        .catch(err => next(err));

};


/**
 * Returns the survey with a given idValidation.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getById = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Extract the user id from the request path
    const surveyId = req.params.id;

    // Extract the query parameters
    const answers = req.query.answers || "false";

    // Set the parameters for the mongo query
    let projection = {};

    // Exclude the answers
    if (answers === "false") projection.usersAnswers = 0;

    // Exclude the idValidation of the users who have answered and the answer date
    if (answers === "true" && !req.isAdmin) {
        projection["usersAnswers.uid"]  = 0;
        projection["usersAnswers.date"] = 0;
    }

    // Find the data
    Survey.findById(surveyId, projection)
        .then(survey => {

            // If no data is found, throw an error
            if (!survey || (survey.markedForDeletion && !req.isAdmin))
                throw constructError(404, "Survey not found.");

            res.status(200).json({ meta: { code: 200 }, data: { survey } });

        })
        .catch(err => next(err));

};


/**
 * Inserts a new survey in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const create = (req, res, next) => {

    // If the request does not come from an admin, throw an error
    if (!checkIfAuthorized(req, next)) return;

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // Create a new survey
    const survey = new Survey({
        title     : req.body.title,
        etc       : req.body.etc,
        area      : req.body.area,
        expireDate: req.body.expireDate,
        questions : req.body.questions
    });

    // Save the new data
    survey.save()
        .then(survey => res.status(201).json({ meta: { code: 201 }, data: { survey } }))
        .catch(err => next(err));

};


/**
 * Updates a survey.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const update = (req, res, next) => {

    // If the request does not come from an admin, throw an error
    if (!checkIfAuthorized(req, next)) return;

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Extract the user id from the request path
    const surveyId = req.params.id;

    // Find the survey
    Survey.findById(surveyId)
        .then(survey => {

            // If no data is found, throw an error
            if (!survey) throw constructError(404, "Survey not found.");

            // Update the data
            survey.title      = req.body.title;
            survey.etc        = req.body.etc;
            survey.area       = req.body.area;
            survey.expireDate = req.body.expireDate;
            survey.questions  = req.body.questions;

            // Save the survey
            return survey.save();

        })
        .then(() => res.status(200).json({ meta: { code: 200 }, data: { id: surveyId } }))
        .catch(err => next(err));

};


/**
 * Adds a new user answer a given survey.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const addUserAnswer = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Extract the user id from the request path
    const surveyId = req.params.id;

    // Find the survey
    Survey.findById(surveyId)
        .then(survey => {

            // If no data is found, throw an error
            if (!survey) throw constructError(404, "Survey not found.");

            // If the user is not an admin and tries to set the user idValidation of the answer, throw an error.
            if (!req.isAdmin && req.body.uid)
                throw constructError(401, "You are not authorized to set the user idValidation of the answer.");

            // If the user is not an admin and tries to set the date of the answer, throw an error.
            if (!req.isAdmin && req.body.date)
                throw constructError(401, "You are not authorized to set the date of the answer.");

            // ToDo check:
            //        - questions idValidation in the answers are among the actual questions
            //        - number of answers matches the number of questions
            //        - answers are coherent with question type

            // Construct the new answer
            const answer = {
                uid    : req.body.uid || req.userId,
                date   : req.body.date || new Date(),
                answers: req.body.answers
            };

            // Save the new answer
            survey.usersAnswers.push(answer);

            // Save the survey
            return survey.save();

        })
        .then(() => res.status(200).json({ meta: { code: 200 }, data: { id: surveyId } }))
        .catch(err => next(err));

};


/**
 * Mark a survey for deletion.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const markForDeletion = (req, res, next) => {

    // If the request does not come from an admin, throw an error
    if (!checkIfAuthorized(req, next)) return;

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Extract the survey id from the request path
    const surveyId = req.params.id;

    // Find the survey
    Survey.findById(surveyId)
        .then(survey => {

            // If no data is found, throw an error
            if (!survey) throw constructError(404, "Survey not found.");

            // Mark the survey for deletion
            survey.markedForDeletion = true;

            // Save the change
            return survey.save();

        })
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
