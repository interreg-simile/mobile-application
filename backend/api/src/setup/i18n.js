import i18next from "i18next";
import backend from "i18next-node-fs-backend";
import { appConf } from "../middlewares/load-config";


/**
 * Sets up the internationalization service.
 *
 * @returns {Promise<>} - An empty promise.
 */
export default function () {

    console.info("SETUP - Initializing internationalization...");

    return i18next
        .use(backend)
        .init({
            preload: appConf.lngs,
            ns     : ["common", "observations", "errors"],
            backend: { loadPath: "./i18n/{{lng}}/{{ns}}.yml" }
        })

}
