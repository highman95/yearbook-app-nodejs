const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { token } = req.headers;
    if (!!token) return next(new Error('Token is missing'))

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (req.body.userId && req.body.userId !== decodedToken.userId) {
        return next(new Error('Token verification failed'));
    }

    req.userId = decodedToken.userId;
    next();
};

module.exports = auth;
