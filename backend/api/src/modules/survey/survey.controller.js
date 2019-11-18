import Survey from "./survey.model";

// Returns all the surveys saved in the database.
export const getAll = (req, res, next) => {

    // Find all the surveys
    Survey.find({})
        .then(surveys => {

            // Return the data
            res.status(200).json({
                message: "Surveys fetched successfully",
                data   : surveys
            });

        })
        .catch(err => next(err));

};

