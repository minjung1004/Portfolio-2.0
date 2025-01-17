const mongoose = require('mongoose');

const Scheme = mongoose.Schema;
const PostScheme = new Scheme({
    topic: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    linkTitle: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    keyword: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Post', PostScheme);