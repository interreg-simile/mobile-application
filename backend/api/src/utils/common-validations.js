import { oneOf, param, query } from "express-validator";


export const idValidation = [
    param("idValidation").isMongoId().withMessage("Wrong format of path parameter 'idValidation'.")
];


/** Possible regions of interest. */
export const roiEnum = ["lake_como", "lake_maggiore", "lake_lugano"];

/** Possible countries. */
export const countryEnum = ["italy", "switzerland"];
