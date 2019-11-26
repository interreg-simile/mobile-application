export enum QuestionType { singleAnswer, freeText }

interface questionInterface {
    position: number,
    body: string,
    type: QuestionType,
    answers?: [{ position: number, body: string }]
}


export class Survey {

    /** Unique id of the survey. */
    id: string;

    /** Title of the survey. */
    title: string;

    /** Estimated time to complete of the survey. */
    etc?: string;

    /** Area of the survey. */
    area?: string;

    /** Expire date of the survey. */
    expireDate?: Date;

    /** Questions of the survey. */
    questions?: questionInterface[];

    /** Date of completion. */
    completionDate?: Date;


    /** @ignore */
    constructor(id: string, title: string, etc: string, area: string, expireDate?: Date,
                questions?: questionInterface[], completionDate?: Date) {
        this.id             = id;
        this.title          = title;
        this.etc            = etc;
        this.area           = area;
        this.expireDate     = expireDate;
        this.questions      = questions;
        this.completionDate = completionDate;
    }

}

