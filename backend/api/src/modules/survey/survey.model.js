import mongoose, { Schema } from "mongoose";

import { collection as User } from "../user/user.model";

export const collection = "Survey";

const answerSchema = new Schema({
    position: { type: Number, required: true },
    body    : { type: String, required: true }
});

const questionSchema = new Schema({
    position: { type: Number, required: true },
    body    : { type: String, required: true },
    answers : { type: [answerSchema], required: true }
});

const userAnswerSchema = new Schema({
    // uid : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    uid    : { type: String, required: true },
    date   : { type: Date, required: true },
    answers: {
        type       : [
            {
                question: { type: mongoose.Schema.Types.ObjectId, required: true },
                answer  : { type: mongoose.Schema.Types.ObjectId, required: true }
            }
        ], required: true
    }
});

const schema = new Schema({
    title       : { type: String, required: true },
    etc         : { type: String, required: true },
    area        : { type: String, required: true },
    expireDate  : { type: Date, required: true },
    questions   : { type: [questionSchema], required: true },
    usersAnswers: [userAnswerSchema]
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
