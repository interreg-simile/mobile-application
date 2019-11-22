import { body, oneOf } from "express-validator";

export const questionTypeEnum = ["singleAnswer", "freeText"];

export const mainInfo = [
    body("title")
        .trim()
        .escape()
        .not().isEmpty().withMessage("Missing property 'title'."),
    body("etc")
        .trim()
        .escape()
        .not().isEmpty().withMessage("Missing property 'etc'."),
    body("area")
        .trim()
        .escape()
        .not().isEmpty().withMessage("Missing property 'area'."),
    body("expireDate")
        .not().isEmpty().withMessage("Missing property 'expireDate'.")
        .isISO8601().withMessage("Wrong format of property 'expireDate'.")
];

const answers = [
    body("questions.*.answers.*.position")
        .not().isEmpty().withMessage("Missing property 'position' of one of the answers of one of the questions.")
        .isInt().withMessage("Wrong format of property 'position' of one of the answers of one of the questions."),
    body("questions.*.answers.*.body")
        .trim()
        .escape()
        .not().isEmpty().withMessage("Missing property 'body' of one of the answers of one of the questions."),
];

export const questions = [
    body("questions")
        .not().isEmpty().withMessage("Missing property 'questions'.")
        .isArray().withMessage("Wrong format of property 'questions'."),
    body("questions.*.position")
        .not().isEmpty().withMessage("Missing property 'position' of one of the questions.")
        .isInt().withMessage("Wrong format of property 'position' of one of the questions."),
    body("questions.*.body")
        .trim()
        .escape()
        .not().isEmpty().withMessage("Missing property 'body' of one of the questions."),
    body("questions.*.type")
        .not().isEmpty().withMessage("Missing property 'type' of one of the questions.")
        .isIn(questionTypeEnum).withMessage("Forbidden value of property 'type' of one of the questions."),
    oneOf(
        [body("questions.*.answers").not().exists(), answers],
        "Invalid or missing value of one of the properties of one of answers of one of the questions."
    )
];

export const all = [...mainInfo, ...questions];
