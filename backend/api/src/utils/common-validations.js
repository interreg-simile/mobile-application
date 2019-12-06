import { oneOf, param, query } from "express-validator";


export const idValidation = [
    param("id").isMongoId().withMessage("Wrong format of path parameter 'id'.")
];


/** Possible regions of interest. */
export const roiEnum = ["lake_como", "lake_maggiore", "lake_lugano"];

/** Possible countries. */
export const countryEnum = ["italy", "switzerland"];
