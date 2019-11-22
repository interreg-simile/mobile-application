import mongoose from "mongoose";

import Survey, { collection } from "./survey.model";
import User from "../user/user.model";
import { NODE_ENV } from "../../config/env";

export default async function () {

    console.info("SEED - Survey...");

    // If the program is running in development mode, clear the collection
    if (NODE_ENV === "development") await mongoose.connection.dropCollection(collection);

    const user = await User.findOne().sort({ createdAt: -1 });

    const surveys = [
        {
            title     : "Questionario progetto SIMILE per residenti in Italia",
            etc       : "4 minuti",
            area      : "Como",
            expireDate: new Date(2020, 11, 19),
            questions : [
                {
                    position: 1,
                    body    : "Question 1",
                    type    : "singleAnswer",
                    answers : [
                        { position: 1, body: "Answer 1" },
                        { position: 2, body: "Answer 2" },
                        { position: 3, body: "Answer 3" },
                        { position: 4, body: "Answer 4" }
                    ]
                },
                {
                    position: 2,
                    body    : "Question 2",
                    type    : "singleAnswer",
                    answers : [
                        { position: 1, body: "Answer 1" },
                        { position: 2, body: "Answer 2" },
                        { position: 3, body: "Answer 3" }
                    ]
                },
                { position: 3, body: "Question 3", type: "freeText" }
            ]
        },
        {
            title     : "Test survey",
            etc       : "7 minuti",
            questions : [
                { position: 1, body: "Question 1", type: "freeText" },
                {
                    position: 2,
                    body    : "Question 2",
                    type    : "singleAnswer",
                    answers : [
                        { position: 1, body: "Answer 1" },
                        { position: 2, body: "Answer 2" },
                        { position: 3, body: "Answer 3" },
                        { position: 4, body: "Answer 4" },
                        { position: 5, body: "Answer 5" }
                    ]
                }
            ],
            area      : "-",
            expireDate: new Date(2018, 11, 19)
        }
    ];

    const user1Id = await User.findOne({ email: "user1@example.com" }, "_id"),
          user2Id = await User.findOne({ email: "user2@example.com" }, "_id");

    for (let i = 0; i < surveys.length; i++) {

        const data = await Survey.create(surveys[i]);

        data.usersAnswers = [{
            uid    : user1Id,
            date   : new Date(),
            answers: populateAnswers(data.questions)
        }];

        if (i === 0)
            data.usersAnswers.push({
                uid    : user2Id,
                date   : new Date(),
                answers: populateAnswers(data.questions)
            });

        await data.save();

    }

}

function populateAnswers(questions) {

    const answers = [];

    for (let i = 0; i < questions.length; i++) {

        const q = questions[i],
              a = { question: q._id };

        if (q.type === "singleAnswer")
            a.answer = q.answers[0]._id;

        if (q.type === "freeText")
            a.answer = "Free text question answer.";

        answers[i] = a;

    }

    return answers;

}
