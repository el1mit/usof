const bcrypt = require('bcryptjs');

module.exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    const passwordHashed = await bcrypt.hash(password, salt);
    return passwordHashed;
}
