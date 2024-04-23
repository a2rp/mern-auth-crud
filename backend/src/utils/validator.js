
module.exports.isValidEmail = (emailAdress) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailAdress.match(regex))
        return true;
    else
        return false;
}

module.exports.isValidUsername = (username) => {
    const res = /^[a-zA-Z0-9_]+$/.exec(username);
    const valid = !!res;
    return valid;
}

module.exports.isValidPassword = (password) => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    return reg.test(password);
};


