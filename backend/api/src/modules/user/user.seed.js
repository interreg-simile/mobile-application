import User from "./user.model";

export default async function () {

    console.info("SEED - User...");

    const users = [
        {
            email      : "user@example.com",
            password   : "123456",
            role       : "user",
            isConfirmed: "true",
            name       : "Mario Rossi",
            city       : "Como",
            cap        : "22100",
            age        : "18-25",
            gender     : "male"
        }
    ];

    for (const user of users) await User.create(user);

}
