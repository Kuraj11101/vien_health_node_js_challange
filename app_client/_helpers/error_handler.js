module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) == 'string') {
        //application error
        return res.status(400).json({ message:err });
    }

    if (err.name == "ValidationError") {
        // mongodb validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name == "UnauthorizedError") {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    //default to 00 server error
    return res.status(500).json({ message: err.message });
}