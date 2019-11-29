import { body, query } from "express-validator";

export const participants = [
    body("participants")
        .isInt({ min: 0 }).withMessage("Invalid value of property 'participants'.")
];

export const getAllQuery = [
    query("includePast")
        .optional()
        .isBoolean().withMessage("Invalid value of query parameter 'includePast'."),
    query("includeDeleted")
        .optional()
        .isBoolean().withMessage("Invalid value of query parameter 'includeDeleted'."),
    query("orderByDate")
        .optional()
        .isBoolean().withMessage("Invalid value of query parameter 'orderByDate'."),
    query("city")
        .optional()
        .custom((val, { req }) => !(req.query.postalCode || req.query.coords))
        .withMessage("You can pass only one query parameter among 'city', 'postalCode' and 'coords'.")
        .trim()
        .escape(),
    query("postalCode")
        .optional()
        .custom((val, { req }) => !(req.query.city || req.query.coords))
        .withMessage("You can pass only one query parameter among 'city', 'postalCode' and 'coords'.")
        .isPostalCode("any").withMessage("Invalid value of query parameter 'postalCode'."),
    query("coords")
        .optional()
        .custom((val, { req }) => !(req.query.city || req.query.postalCode))
        .withMessage("You can pass only one query parameter among 'city', 'postalCode' and 'coords'.")
        .isLatLong().withMessage("Invalid value of query parameter 'coords'."),
    query("buffer")
        .optional()
        .isFloat({ min: 0.00 }).withMessage("Invalid value of query parameter 'buffer'."),
];
