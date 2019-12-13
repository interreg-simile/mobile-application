import { Rois } from "../../shared/common.enum";


export class Alert {

    /** Unique idValidation of the alert. */
    id: string;

    /** Title in italian of the alert. */
    titleIta: string;

    /** Title in english of the alert. */
    titleEng?: string;

    /**  Content in italian of the alert. */
    contentIta: string;

    /**  Content in english of the alert. */
    contentEng?: string;

    /** Starting date of the alert. */
    dateStart: Date;

    /** Ending date of the alert. */
    dateEnd: Date;

    /** Regions of interest affected by the alert. */
    rois: Rois[];

    /** Flag that states if the communication has already been read by the user. */
    read: Boolean;


    /** @ignore */
    constructor(id: string, titleIta: string, titleEng: string, contentIta: string, contentEng: string,
                dateStart: Date, dateEnd: Date, rois: Rois[], read: Boolean) {
        this.id         = id;
        this.titleIta   = titleIta;
        this.titleEng   = titleEng;
        this.contentIta = contentIta;
        this.contentEng = contentEng;
        this.dateStart  = dateStart;
        this.dateEnd    = dateEnd;
        this.rois       = rois;
        this.read       = read;
    }

}
