module.exports.isValidEmail = (emailAddress) =>
    typeof emailAddress === "string" && emailAddress.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);

module.exports.isValidUsername = (username) => /^[a-zA-Z0-9_]{3,32}$/.test(username);

module.exports.isValidPassword = (password) =>
    typeof password === "string"
    && Buffer.byteLength(password, "utf8") <= 72
    && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/.test(password);
