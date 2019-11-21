import Survey from "./survey.model";

// Returns all the surveys saved in the database.
export const getAll = (req, res, next) => {

    // Retrieve the query parameters
    const expired = req.query.expired,
          answers = req.query.answers;

    // Check parameter "answers" against the user id // ToDo check for admin
    if ((answers === "curr" || answers === "all") && !req.userId) {
        const error      = new Error("Unauthorized. Wrong value of parameter 'answers'.");
        error.statusCode = 401;
        next(error);
        return;
    }

    // Set the parameters for the mongo query
    let queryParams = {};

    if (expired === "false") queryParams.expireDate = { $gt: new Date() };

    // Find the data
    Survey.find(queryParams)
        .then(surveys => res.status(200).json({
            meta: { code: 200 },
            data: { surveys }
        }))
        .catch(err => next(err));

};

