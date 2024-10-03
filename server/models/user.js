const mongoose = require('mongoose');

const Scheme = mongoose.Schema;
const UserScheme = new Scheme({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('User', UserScheme);