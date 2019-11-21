export default function (req, res, next) {

    req.userId = "abc";

    next();

}
