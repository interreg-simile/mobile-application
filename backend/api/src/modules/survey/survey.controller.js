import mongoose from "mongoose";
import { validationResult } from "express-validator";

import Survey from "./survey.model";
import User from "../user/user.model";


// Returns all the surveys saved in the database.
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
        const error      = new Error("You are not authorized to set query parameter includeDeleted to true.");
        error.statusCode = 401;
        error.type       = "NotAuthorizedException";
        next(error);
        return;
    }

    // Take the surveys with expireDate greater or equal to the current date
    if (includeExpired === "false") filter.expireDate = { $gte: new Date() };

    // Exclude the answers
    if (includeUsersAnswers === "false") projection.usersAnswers = 0;

    // Exclude the id of the user who has answered and the answer date
    if (includeUsersAnswers === "true" && !req.isAdmin) {
        projection["usersAnswers.uid"]  = 0;
        projection["usersAnswers.date"] = 0;
    }

    // Find the data
    Survey.find(filter, projection)
        .then(surveys => res.status(200).json({ meta: { code: 200 }, data: { surveys } }))
        .catch(err => next(err));

};


// Returns the surveys done or not done by a given user.
export const getByUser = (req, res, next) => {

    // Extract the user id from the request path
    const userId = req.params.userId;

    // If the id is valid, throw an error
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error      = new Error("Id not valid.");
        error.statusCode = 400;
        error.type       = "BadIdException";
        next(error);
        return
    }

    // If the request does not come from an admin and the user is requesting the data of another user, throw an error
    if (!req.isAdmin && req.userId !== userId) {
        const error      = new Error("You are not authorized to request data about this user.");
        error.statusCode = 401;
        error.type       = "NotAuthorizedException";
        next(error);
        return;
    }

    // Find the user
    User.findById(userId)
        .then(user => {

            // If the user does not exist, throw an error
            if (!user) {

                const error      = new Error("User not found.");
                error.statusCode = 404;
                error.type       = "NotFoundException";
                next(error);
                return;

            }

            // Extract the query parameters
            const includeExpired = req.query.includeExpired || "true",
                  includeDeleted = req.query.includeDeleted || "false",
                  invert         = req.query.invert || "false";

            // Set the parameters for the mongo query
            let filter     = {};
            let projection = {};

            // Exclude the survey marked for deletion
            if (includeDeleted === "false") filter.markedForDeletion = false;

            // If the request does not come from an admin, throw an error
            else if (includeDeleted === "true" && !req.isAdmin) {
                const error      = new Error("You are not authorized to set query parameter includeDeleted to true.");
                error.statusCode = 401;
                error.type       = "NotAuthorizedException";
                next(error);
                return;
            }

            if (invert === "false") {

                // Take only the surveys done by the user
                filter["usersAnswers.uid"] = userId;

                // Return only the answers of the user
                projection.usersAnswers = { $elemMatch: { uid: userId } };

            } else {

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
        .then(surveys => res.status(200).json({ meta: { code: 200 }, data: { surveys } }))
        .catch(err => next(err));

};


// Returns the survey with a given id.
export const getById = (req, res, next) => {

    // Extract the user id from the request path
    const surveyId = req.params.surveyId;

    // If the id is valid, throw an error
    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
        const error      = new Error("Id not valid.");
        error.statusCode = 400;
        error.type       = "BadIdException";
        next(error);
        return;
    }

    // Extract the query parameters
    const answers = req.query.answers || "false";

    // Set the parameters for the mongo query
    let projection = {};

    // Exclude the answers
    if (answers === "false") projection.usersAnswers = 0;

    // Exclude the id of the users who have answered and the answer date
    if (answers === "true" && !req.isAdmin) {
        projection["usersAnswers.uid"]  = 0;
        projection["usersAnswers.date"] = 0;
    }

    // Find the data
    Survey.findById(surveyId, projection)
        .then(survey => {

            // If no data is found, throw an error
            if (!survey || (survey.markedForDeletion && !req.isAdmin)) {
                const error      = new Error("Survey not found.");
                error.statusCode = 404;
                error.type       = "NotFoundException";
                throw error;
            }

            res.status(200).json({ meta: { code: 200 }, data: { survey } });

        })
        .catch(err => next(err));

};


// Inserts a new survey in the database.
export const create = (req, res, next) => {

    // If the request does not come from an admin, throw an error
    if (!req.isAdmin) {
        const error      = new Error("You are not authorized to create this resource.");
        error.statusCode = 401;
        error.type       = "NotAuthorizedException";
        next(error);
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.errors);
        const error      = new Error(errors.errors[0].msg);
        error.statusCode = 422;
        error.type       = "BodyValidationException";
        next(error);
        return;
    }

    res.status(201).json({ meta: { code: 201 } });

    // // Create a new survey
    // const survey = new Survey({
    //     title     : req.body.title,
    //     etc       : req.body.etc,
    //     area      : req.body.area,
    //     expireDate: req.body.expireDate,
    //     questions : req.body.questions
    // });
    //
    // // Save the new data
    // survey.save()
    //     .then(survey => res.status(201).json({ meta: { code: 201 }, data: { survey } }))
    //     .catch(err => next(err));

};


// Updates the general information of a survey.
export const updateGeneralInfo = (req, res, next) => {

};


// Adds a new user answer to the survey.
export const addUserAnswer = (req, res, next) => {

};


// Mark a survey for deletion.
export const markForDeletion = (req, res, next) => {

    // Extract the user id from the request path
    const surveyId = req.params.surveyId;

    // If the id is valid, throw an error
    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
        const error      = new Error("Id not valid.");
        error.statusCode = 400;
        error.type       = "BadIdException";
        next(error);
        return;
    }

    // If the request does not come from an admin, throw an error
    if (!req.isAdmin) {
        const error      = new Error("You are not authorized to delete this resource.");
        error.statusCode = 401;
        error.type       = "NotAuthorizedException";
        next(error);
        return;
    }

    Survey.findById(surveyId)
        .then(survey => {

            // If no data is found, throw an error
            if (!survey) {
                const error      = new Error("Survey not found.");
                error.statusCode = 404;
                error.type       = "NotFoundException";
                throw error;
            }

            // Mark the survey for deletion
            survey.markedForDeletion = true;

            // Save the change
            return survey.save();

        })
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
