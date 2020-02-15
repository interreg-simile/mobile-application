/**
 * @fileoverview This file contains the controller for the miscellaneous endpoints. The controllers are manages which
 * interact with the requests, take what it needs from Express, does some validation, passes the data to the right
 * service(s) and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { checkValidation } from "../../utils/common-checks";
import { OPEN_WEATHER_KEY } from "../../setup/env";
import * as miscService from "./misc.service";


/**
 * Returns the current weather data for one location defined by a set of coordinates. The results are taken from the
 * OpenWeather API.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getWeather = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Retrieve the query parameters
    const lat = req.query.lat,
          lon = req.query.lon;

    const query = { lat: lat, lon: lon, appid: OPEN_WEATHER_KEY, lang: req.lng, units: "metric" };

    miscService.getWeather(query)
        .then(data => res.status(200).json({ meta: { code: 200 }, data: data }))
        .catch(err => next(err));

};
