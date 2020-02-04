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

    // Set the default language
    let lng = appConf.defaultLng;

    // Extract the accepted languages
    const lngHeader = req.get("Accept-Language");

    // If the header is provided
    if (lngHeader) {

        // Loop through the specified languages
        lngHeader.split(",").some(l => {

            // If the language is supported
            if (appConf.lngs.includes(l.trim())) {

                // Save it
                lng = l.trim();

                // Return true
                return true;

            }

            // Return false
            return false;

        });

    }

    // Save the language and the fixed t function in the request object
    req.lng = lng;
    req.t   = i18next.getFixedT(lng);

    // Set the response header
    res.set("Content-Language", lng);

    // Call the next middleware
    next()


}
