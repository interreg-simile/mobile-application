import User from "./user.model";

export default async function () {

    console.info("SEED - User...");

    const users = [
        {
            _id        : "adminId",
            email      : "admin@example.com",
            password   : "123456",
            role       : "admin",
            isConfirmed: "true",
            name       : "Carlo Colombo",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male"
        },
        {
            _id        : "simpleUserId",
            email      : "user@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Mario Rossi",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male"
        },
        {
            _id        : "otherUserId",
            email      : "user2@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Federica Bianchi",
            city       : "Lecco",
            cap        : "23900",
            age        : "30-35",
            gender     : "female"
        }
    ];

    for (const user of users) await User.create(user);

}
