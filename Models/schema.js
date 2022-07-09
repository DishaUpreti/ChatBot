const mongoose = require('mongoose');       
//schemas


const questionsSchema = new mongoose.Schema({
    Question: {
        type: String,
        uppercase: true,

    },
    Answer: {
        type: String,
        uppercase: true,
    }
});

const adminSchema = new mongoose.Schema({
    AdminName: String,
    Password: String,
});

//models
const questions = mongoose.model('questions', questionsSchema);
const admin = mongoose.model('admin', adminSchema);

module.exports = {
    questions,
    admin
}
