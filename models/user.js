const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    lastLogin: {
        type: String,
        required: false
    },
},{
    timestamps:true,
});

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;