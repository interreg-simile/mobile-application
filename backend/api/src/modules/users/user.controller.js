import User from "./user.model";

// Returns all the surveys saved in the database.
export const getTest = (req, res, next) => {

    // Find all the surveys
    User.findOne({})
        .then(user => {

            // Return the data
            res.status(200).json({ data: user });

        })
        .catch(err => next(err));

};

