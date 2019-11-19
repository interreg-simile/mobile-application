import Survey from "./survey.model";
import User from "../user/user.model";

export default async function () {

    console.info("SEED - Survey...");

    const user = await User.findOne().sort({ createdAt: -1 });

    const surveys = [
        {
            titleIta   : "Questionario progetto SIMILE per residenti in Italia",
            titleEng   : "Project SIMILE survey for Italian citizens",
            etc        : "4 minutes",
            completedBy: [{ uid: user._id, date: new Date() }]
        }
    ];

    for (const survey of surveys) await Survey.create(survey);

}
