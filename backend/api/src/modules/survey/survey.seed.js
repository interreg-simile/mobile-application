import Survey from "./survey.model";
import User from "../user/user.model";

export default async function () {

    console.info("SEED - Survey...");

    const user = await User.findOne().sort({ createdAt: -1 });

    const surveys = [
        {
            title      : "Questionario progetto SIMILE per residenti in Italia",
            etc        : "4 minuti",
            completedBy: [{ uid: "abc", date: new Date() }],
            area       : "Como",
            expireDate : new Date(2020, 11, 19)
        },
        {
            title     : "Test survey",
            etc       : "7 minuti",
            area      : "-",
            expireDate: new Date(2018, 11, 19)
        }
    ];

    for (const survey of surveys) await Survey.create(survey);

}
