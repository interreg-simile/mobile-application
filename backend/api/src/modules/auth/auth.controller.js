import crypto from "crypto";

import APIKey from "./keys.model"

export const generateApiKey = (req, res, next) => {

    // Generate a random key
    const key = crypto.randomBytes(32).toString("hex");

    new APIKey({ key: key }).save()
        .then(() => { res.status(201).json({ meta: { code: 201 }, data: { key: key } }) })
        .catch(err => next(err));

};

