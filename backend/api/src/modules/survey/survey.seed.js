import Survey from "./survey.model";

export default async function () {

    console.info("SEED - Survey...");

    const surveys = [
        {
            titleIta: "Questionario progetto SIMILE per residenti in Italia",
            titleEng: "Project SIMILE survey for Italian citizens",
            etc     : "4 minutes"
        }
    ];

    for (const survey of surveys) await Survey.create(survey);

}
