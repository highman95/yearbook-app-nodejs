const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { token } = req.headers;
    if (!token) return next(new Error('Token is missing'))

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (req.body.user_id && req.body.user_id !== decodedToken.user_id) {
        return next(new Error('Token verification failed'))
    }

    req.user_id = decodedToken.user_id;
    next();
};

module.exports = auth;
