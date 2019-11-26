/** Generic API response. */
export interface genericApiResponse {
    meta: { code: number, errorMessage?: string, errorType?: string },
    data: any
}
