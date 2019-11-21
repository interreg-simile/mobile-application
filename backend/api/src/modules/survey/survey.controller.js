import mongoose from "mongoose";

import Survey from "./survey.model";
import User from "../user/user.model";

// Returns all the surveys saved in the database.
export const getAll = (req, res, next) => {

    // Retrieve the query parameters
    const includeExpired = req.query.includeExpired || "true",
          answers        = req.query.answers || "false";

    // Set the parameters for the mongo query
    let filter     = {};
    let projection = {};

    // Take the surveys with expireDate greater or equal to the current date
    if (includeExpired === "false") filter.expireDate = { $gte: new Date() };

    // Exclude the answers
    if (answers === "false") projection.usersAnswers = 0;

    // Exclude the id of the user who has answered and the answer date
    if (answers === "true" && !req.isAdmin) {
        projection["usersAnswers.uid"]  = 0;
        projection["usersAnswers.date"] = 0;
    }

    // Find the data
    Survey.find(filter, projection)
        .then(surveys => res.status(200).json({ meta: { code: 200 }, data: { surveys } }))
        .catch(err => next(err));

};

// Return the surveys done or not done by a given user.
export const getByUser = (req, res, next) => {

    // Extract the user id from the request path
    const userId = req.params.userId;

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
                  invert         = req.query.invert || "false";

            // Set the parameters for the mongo query
            let filter     = {};
            let projection = {};

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

export const getById = (req, res, next) => {

    // Extract the user id from the request path
    const surveyId = req.params.surveyId;

    // Check if id is valid

    // Extract the query parameters
    const answers = req.query.answers || "false";

    // Set the parameters for the mongo query
    let projection = {};

    // Exclude the answers
    if (answers === "false") projection.usersAnswers = 0;

    // Exclude the id of the user who has answered and the answer date
    if (answers === "true" && !req.isAdmin) {
        projection["usersAnswers.uid"]  = 0;
        projection["usersAnswers.date"] = 0;
    }

    // Find the data
    Survey.findById(surveyId, projection)
        .then(survey => {

            if (!survey) {

                const error      = new Error("Survey not found.");
                error.statusCode = 404;
                error.type       = "NotFoundException";
                throw error;

            }

            res.status(200).json({ meta: { code: 200 }, data: { survey } });

        })
        .catch(err => next(err));

};
