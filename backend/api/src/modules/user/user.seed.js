import jwt from "jsonwebtoken";

import { JWT_PK, NODE_ENV } from "../../config/env";
import User, { collection } from "./user.model";
import mongoose from "mongoose";

export default async function () {

    console.info("SEED - User...");

    // If the program is running in development mode, clear the collection
    if (NODE_ENV === "development") await mongoose.connection.dropCollection(collection);

    const users = [
        {
            email      : "admin@example.com",
            password   : "123456",
            role       : "admin",
            isConfirmed: "true",
            name       : "Carlo Colombo",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male"
            // _id: 5dd7bbe0701d5bdd685c1f17
            // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTciLCJpc0FkbWluIjoidHJ1ZSIsImlhdCI6MTU3NDQxOTQyNCwiZXhwIjoxNjYwODE5NDI0fQ.cj2DFb9P8gP9xJpPwgxzcR6JmnVBwDTOAA5KRUN9UkM
        },
        {
            email      : "user1@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Mario Rossi",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male"
            // _id: 5dd7bbe0701d5bdd685c1f18
            // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTgiLCJpc0FkbWluIjoiZmFsc2UiLCJpYXQiOjE1NzQ0MTk0MjQsImV4cCI6MTY2MDgxOTQyNH0.BDS7n-kHgwgCj9c_--aShJ9cWoOe5a8QSM_5a7oM7V8
        },
        {
            email      : "user2@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Federica Bianchi",
            city       : "Lecco",
            cap        : "23900",
            age        : "30-35",
            gender     : "female"
            // _id: 5dd7bbe0701d5bdd685c1f19
            // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTkiLCJpc0FkbWluIjoiZmFsc2UiLCJpYXQiOjE1NzQ0MTk0MjQsImV4cCI6MTY2MDgxOTQyNH0.RY83lM6D6c3DFdkkmFqcsND5m6khJjVjeWsb1FmkZkw
        }
    ];

    for (const user of users) {
        const u = await User.create(user);
        generateUserToken(u);
    }

}

function generateUserToken(user) {

    const token = jwt.sign(
        { userId: user._id.toString(), isAdmin: user.role === "admin" ? "true" : "false" },
        JWT_PK,
        { expiresIn: "1000d" }
    );

    console.log(`${user.email}: ${token}`);

}
