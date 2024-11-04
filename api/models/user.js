const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true, min: 4, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, min: 8}
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;