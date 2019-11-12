import mongoose from "mongoose"

import { MONGO_URL } from "../config/env"

// Connect to the database
export const connect = async () => {

    console.info('SETUP - Connecting database..');

    // Try to connect
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser   : true,
        useCreateIndex    : true,
        useFindAndModify  : false,
        useUnifiedTopology: true
    });

};

export const onError = error => {

    console.log(`ERROR - Connection failed: ${error.message}`);

};

// Handle any connection error
// mongoose.connection.on("error", error => {
//
//     console.log(`ERROR - Connection failed: ${error.message}`);
//
//     // Retry to connect after 5 seconds
//     setTimeout(async () => {
//
//         console.log('SETUP - Connecting database.. retrying..');
//
//         // Try to connect
//         await connectWithRetry();
//
//     }, 5000)
//
// });
//
// // Retry the connection
// const connectWithRetry = async () => {
//
//     return await mongoose.connect(MONGO_URL, {
//         useNewUrlParser   : true,
//         useCreateIndex    : true,
//         useFindAndModify  : false,
//         useUnifiedTopology: true
//     });
//
// };
