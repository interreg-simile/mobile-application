export class Survey {

    /** Unique id of the survey. */
    public id: string;

    /** Title of the survey. */
    public title: string;

    /** Estimated time of completion. */
    public etc: string;

    /** Area of the survey. */
    public area: string;

    /** @ignore */
    constructor(id: string, title: string, etc: string, area: string) {
        this.id    = id;
        this.title = title;
        this.etc   = etc;
        this.area  = area;
    }

}
