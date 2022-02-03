const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
},{
    timestamps:true,
});

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;