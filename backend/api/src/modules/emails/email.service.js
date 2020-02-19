import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport"

import { SEND_GRID_USER, SEND_GRID_KEY, EMAIL_ADDRESS } from "../../setup/env";


/** Nodemailer transporter object. */
const transporter = nodemailer.createTransport(
    sgTransport({ auth: { api_key: SEND_GRID_KEY } })
);


transporter.verify((err, success) => {

    if (err) console.log(err);

    else console.log("Emails work fine!")

});


export async function sendEmail() {

    await transporter.sendMail({
        from   : EMAIL_ADDRESS,
        to     : "edoardopessina@yahoo.it",
        subject: "Test",
        text   : "Mail di prova"
    })

}
