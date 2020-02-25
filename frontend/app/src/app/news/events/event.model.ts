import { LatLng } from "leaflet";


export interface Event {
     id: string,
     title: string,
     description: string,
     coordinates: LatLng,
     address: string,
     rois: Array<string>,
     date: Date,
     contacts: {email?: string, phone?: string},
     read: boolean
}
