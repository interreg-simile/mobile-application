import Survey from "../models/survey";

export const getAll = (req, res, next) => {
    res.status(200).json({ message: "It works!" })
};

