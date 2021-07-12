const expressJwt = require('express-jwt');
config = require('../config/config.json');
const userService = require('../models/users/user.service');

module.exports = expressJwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithm: [HS256], isRevoked }).unless({
        path: [
            // public routes that don't require authentiction
            '/user/authenticte',
            'user/regsiter'
        ]
    });
}
async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if(!user) {
        return done(null, true);
    }

    done();
}