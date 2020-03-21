/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import { appConf } from "./load-config";
import i18next from "i18next";


/**
 * Sets the language of the response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    let lng = appConf.defaultLng;

    const lngHeader = req.get("Accept-Language");

    if (lngHeader) {

        lngHeader.split(",").some(l => {

            if (appConf.lngs.includes(l.trim())) {
                lng = l.trim();
                return true;
            }

            return false;

        });

    }

    req.lng = lng;
    req.t   = i18next.getFixedT(lng);

    res.set("Content-Language", lng);

    next()

}
