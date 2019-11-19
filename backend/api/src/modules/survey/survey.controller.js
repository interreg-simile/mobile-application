import Survey from "./survey.model";

// Returns all the surveys saved in the database.
export const getAll = (req, res, next) => {

    // Retrieve the query parameters
    const expired = req.query.expired,
          answers = req.query.answers;

    // Set the parameters for the mongo query
    let queryParams = {};

    if (expired === "false") queryParams.expireDate = { $gt: new Date() };

    // Find the data
    Survey.find(queryParams)
        .then(surveys => res.status(200).json(surveys))
        .catch(err => next(err));

};

