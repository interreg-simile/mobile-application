import jwt from "jsonwebtoken";

import { JWT_PK } from "../../setup/env";
import User, { collection } from "./user.model";
import { dropCollection } from "../../setup/seeder";


export default async function () {

    console.info("SEED - Users...");

    await dropCollection(collection);

    const users = [
        {
            _id        : "5dd7bbe0701d5bdd685c1f17",
            email      : "admin@example.com",
            password   : "123456",
            role       : "admin",
            isConfirmed: "true",
            name       : "Carlo Colombo",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male",
            // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTciLCJpc0FkbWluIjoidHJ1ZSIsImlhdCI6MTU3NjgzMzI3MywiZXhwIjoxNjYzMjMzMjczfQ.OgIIoFuwHOwW7kXwSD3ZvnxzbaGTOwxDjL0ebejqeGc
        },
        {
            _id: "5dd7bbe0701d5bdd685c1f18",
            email      : "user1@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Mario Rossi",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male"
            // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTgiLCJpc0FkbWluIjoiZmFsc2UiLCJpYXQiOjE1NzY4MzMyNzMsImV4cCI6MTY2MzIzMzI3M30.yYZLnBkZMoVzwaSg-xs5o8ZQXQkcrQA08cd545ubwDI
        },
        {
            _id: "5dd7bbe0701d5bdd685c1f19",
            email      : "user2@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Federica Bianchi",
            city       : "Lecco",
            cap        : "23900",
            age        : "30-35",
            gender     : "female"
            // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTkiLCJpc0FkbWluIjoiZmFsc2UiLCJpYXQiOjE1NzY4MzMyNzMsImV4cCI6MTY2MzIzMzI3M30.ZDznCB9guCzN4ZIurunN3OSlYknmfAXQQ1Oe0A6-k58
        }
    ];

    for (const user of users) {
        const u = await User.create(user);
        // generateUserToken(u);
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
