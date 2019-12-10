import { Rois } from "../shared/common.enum";

export class Communication {

    /** Unique idValidation of the communication. */
    id: string;

    /** Title in italian of the communication. */
    titleIta: string;

    /** Title in english of the communication. */
    titleEng?: string;

    /**  Description in italian of the communication. */
    descriptionIta: string;

    /**  Description in italian of the communication. */
    descriptionEng?: string;

    /** Starting date of the communication. */
    dateStart: Date;

    /** Ending date of the communication. */
    dateEnd: Date;

    /** Regions of interest affected by the communication. */
    rois: Rois[];

    /** Flag that states if the communication has already been read by the user. */
    read: Boolean;


    /** @ignore */
    constructor(id: string, titleIta: string, titleEng: string, descriptionIta: string, descriptionEng: string,
                dateStart: Date, dateEnd: Date, rois: Rois[], read: Boolean) {
        this.id             = id;
        this.titleIta       = titleIta;
        this.titleEng       = titleEng;
        this.descriptionIta = descriptionIta;
        this.descriptionEng = descriptionEng;
        this.dateStart      = dateStart;
        this.dateEnd        = dateEnd;
        this.rois           = rois;
        this.read           = read;
    }

}
