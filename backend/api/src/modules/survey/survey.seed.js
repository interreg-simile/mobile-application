import Survey from "./survey.model";
import User from "../user/user.model";

export default async function () {

    console.info("SEED - Survey...");

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
                    answers : [
                        { position: 1, body: "Answer 1" },
                        { position: 2, body: "Answer 2" },
                        { position: 3, body: "Answer 3" }
                    ]
                },
                {
                    position: 3,
                    body    : "Question 3",
                    answers : [
                        { position: 1, body: "Answer 1" },
                        { position: 2, body: "Answer 2" },
                        { position: 3, body: "Answer 3" },
                        { position: 4, body: "Answer 4" },
                        { position: 5, body: "Answer 5" }
                    ]
                }
            ]
        },
        {
            title     : "Test survey",
            etc       : "7 minuti",
            questions : [
                {
                    position: 1,
                    body    : "Question 1",
                    answers : [
                        { position: 1, body: "Answer 1" },
                        { position: 2, body: "Answer 2" },
                        { position: 3, body: "Answer 3" }
                    ]
                },
                {
                    position: 2,
                    body    : "Question 2",
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

    for (let i = 0; i < surveys.length; i++) {

        const data = await Survey.create(surveys[i]);

        const questionsId = data.questions.map(q => q._id),
              answersId   = data.questions.map(q => q.answers[0]._id);

        data.usersAnswers = [{
            uid    : "otherUserId",
            date   : new Date(),
            answers: createUserAnswers(questionsId, answersId)
        }];

        if (i === 0)
            data.usersAnswers.push({
                uid    : "simpleUserId",
                date   : new Date(),
                answers: createUserAnswers(questionsId, answersId)
            });

        await data.save();

    }

}

function createUserAnswers(questionsId, answersId) {

    const answers = [];

    for (let i = 0; i < questionsId.length; i++)
        answers[i] = { question: questionsId[i], answer: answersId[i] };

    return answers;

}
