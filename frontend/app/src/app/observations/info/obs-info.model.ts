interface Position {
    open?: boolean,
    type: string,
    coordinates: Array<number>,
    accuracy?: number,
    custom: boolean,
    roi?: string
}

interface Weather {
    open?: boolean,
    temperature?: number,
    sky: { code: number, description: string },
    wind?: number
}

interface Details {
    open?: boolean,

    algae?: {
        open?: boolean,
        extension?: { code: number, description: string },
        look?: { code: number, description: string },
        colour?: { code: number, description: string },
        iridescent?: boolean
    },

    foams?: {
        open?: boolean,
        extension?: { code: number, description: string },
        look?: { code: number, description: string },
        height?: { code: number, description: string }
    },

    oils?: {
        open?: boolean,
        extension?: { code: number, description: string },
        type?: { code: number, description: string }
    },

    litters?: {
        open?: boolean,
        quantity?: { code: number, description: string },
        type?: Array<{ code: number, description: string }>
    },

    odours?: {
        open?: boolean,
        intensity?: { code: number, description: string },
        origin?: Array<{ code: number, description: string }>
    },

    outlets?: {
        open?: boolean,
        inPlace?: boolean,
        terminal?: { code: number, description: string },
        colour?: { code: number, description: string },
        vapour?: boolean,
        signage?: boolean,
        signagePhoto?: string,
        prodActNearby?: boolean,
        prodActNearbyDetails?: string
    }

    fauna?: {
        open?: boolean,
        deceased?: {
            fish?: { checked: boolean, details: string },
            birds?: { checked: boolean, details: string },
            other?: { checked: boolean, details: string },
        },
        abnormal?: {
            fish?: { checked: boolean, details: string },
            birds?: { checked: boolean, details: string },
            other?: { checked: boolean, details: string }
        },
        alienSpecies?: {
            crustaceans?: { checked: boolean, details: string },
            molluscs?: { checked: boolean, details: string },
            turtles?: { checked: boolean, details: string },
            fish?: { checked: boolean, details: string },
            other?: { checked: boolean, details: string },
        }
    },

    other: string

}

interface Measures {
    open?: boolean,

    transparency?: {
        open?: boolean,
        val: number,
        instrument: { type: { code: number }, brand?: string, precision?: string, details?: string }
    },

    temperature?: {
        open?: boolean,
        multiple: boolean,
        val: [{ depth: number, val: number }],
        instrument: { type: { code: number }, brand?: string, precision?: string, details?: string }
    },

    ph?: {
        open?: boolean,
        multiple: boolean,
        val: [{ depth: number, val: number }],
        instrument: { type: { code: number }, brand?: string, precision?: string, details?: string }
    },

    oxygen?: {
        open?: boolean,
        multiple: boolean,
        percentage: boolean,
        val: [{ depth: number, val: number }],
        instrument: { type: { code: number }, brand?: string, precision?: string, details?: string }
    },

    bacteria?: {
        open?: boolean,
        escherichiaColi?: number,
        enterococci?: number
    }

}

export interface ObsInfo {
    uid: string,
    position: Position,
    weather: Weather,
    photos: Array<string>,
    details?: Details,
    measures?: Measures,
    markedForDeletion: boolean,
    createdAt: string,
    updatedAt: string
}
