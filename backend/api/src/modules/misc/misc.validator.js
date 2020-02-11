/**
 * @fileoverview This file contains express-validator validation chains regarding the `misc` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
import { query } from "express-validator";


export const weather = [
    query("lat").not().isEmpty().isFloat(),
    query("lon").not().isEmpty().isFloat(),
];
