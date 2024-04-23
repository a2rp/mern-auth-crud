const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: 15 * 60 * 60,
    });
};

