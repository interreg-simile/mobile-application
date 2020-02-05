/**
 * @fileoverview This file contains express-validator validation chains regarding the `auth` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body } from "express-validator";


// Validation for the body of a post request
export const apiKey = [
    body("description")
        .escape().trim()
        .not().isEmpty().isAscii()
];
