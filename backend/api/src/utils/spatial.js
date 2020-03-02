/**
 * @fileoverview This file contains various functions for manipulating the spatial data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import proj4 from "proj4";
import path from "path";
import yaml from "yamljs";


/** List of supported projections. */
export const crsConfig = (yaml.load(path.resolve("./config/default.yaml"))).crs;


/** Loads all the projections in the config file. */
export function loadProjections() {

    Object.keys(crsConfig).forEach(k => proj4.defs(k, crsConfig[k]));

}


/**
 * Project the given WGS 84 coordinated into another reference system.
 *
 * @param {string} projectionCode - The code of the target reference system.
 * @param {number} lat - The latitude.
 * @param {number} lon - The longitude.
 * @return {{lon: number, lat: number}} - The projected coordinates.
 */
export function project(projectionCode, lat, lon) {

    const projectedCoords = proj4(proj4.defs("1"), projectionCode, [lat, lon]);

    return { lat: projectedCoords[0], lon: projectedCoords[1] };

}
