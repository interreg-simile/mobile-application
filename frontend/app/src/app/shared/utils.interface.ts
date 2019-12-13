/** Generic API response. */
export interface GenericApiResponse {
    meta: { code: number, errorMessage?: string, errorType?: string },
    data: any
}


/** Point interface. */
export interface Point {
    type: string,
    coordinates: number[]
}
