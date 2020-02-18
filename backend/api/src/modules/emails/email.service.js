// import nodemailer from "nodemailer";
//
// import { EMAIL_ADDRESS, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USERNAME } from "../../setup/env";
//
//
// /** Nodemailer transporter object. */
// const transporter = nodemailer.createTransport({
//     host      : EMAIL_HOST,
//     port      : EMAIL_PORT,
//     // auth      : { user: EMAIL_USERNAME, password: EMAIL_PASSWORD },
//     logger    : true,
//     debug     : true
// });
//
//
// transporter.verify((err, success) => {
//
//     if (err) console.log(err);
//
//     else console.log("Emails work fine!")
//
// });
//
//
// export async function sendEmail() {
//
//     await transporter.sendMail({
//         from   : EMAIL_ADDRESS,
//         to     : "edoardopessina@yahoo.it",
//         subject: "Test",
//         text   : "Mail di prova"
//     })
//
// }
