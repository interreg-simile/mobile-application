/**
 * @fileoverview This file contains the Mongoose model for a send email.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { collection as User } from "../users/user.model";


/** Name of the collection. */
export const collection = "Emails";


/** Schema of an email. */
const schema = new Schema({
    to     : { type: Schema.Types.ObjectId, ref: User, required: true },
    from   : { type: String, required: true },
    subject: { type: String, required: true },
    body   : { type: String, required: true }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
