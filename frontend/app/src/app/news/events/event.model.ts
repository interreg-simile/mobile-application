import { Rois } from "../../shared/common.enum";
import { Point } from "../../shared/utils.interface";


/** Interface of an address. */
interface Address {
    main: string,
    civic: string,
    city: string,
    postalCode: number,
    province: string,
    country: string
}


/** Interface of the contacts object. */
interface Contacts {
    mail?: string,
    phone?: string
}


export class Event {

    /** Unique idValidation of the event. */
    id: string;

    /** Title in italian of the event. */
    titleIta: string;

    /** Title in english of the event. */
    titleEng?: string;

    /** Description in italian of the event. */
    descriptionIta: string;

    /** Description in italian of the event. */
    descriptionEng?: string;

    /** Position of the event. */
    position: Point;

    /** Address of the event. */
    address: Address;

    /** Regions of interest affected by the event. */
    rois: Rois[];

    /** Date of the event. */
    date: Date;

    /** Image url of the event. */
    imageUrl: string;

    /** Contacts. */
    contacts?: Contacts;

    /** Flag that states if the event has already been read by the user. */
    read: Boolean;


    /** @ignore */
    constructor(id: string, titleIta: string, titleEng: string, descriptionIta: string, descriptionEng: string,
                position: Point, address: Address, rois: Rois[], date: Date, imageUrl: string, contacts: Contacts,
                read: boolean) {
        this.id             = id;
        this.titleIta       = titleIta;
        this.titleEng       = titleEng;
        this.descriptionIta = descriptionIta;
        this.descriptionEng = descriptionEng;
        this.position       = position;
        this.address        = address;
        this.rois           = rois;
        this.date           = date;
        this.imageUrl       = imageUrl;
        this.contacts       = (contacts && Object.entries(contacts).length === 0) ? null : contacts;
        this.read           = read;
    }
}
