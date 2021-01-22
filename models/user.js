const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Username cannot be blank'],
        unique: true
    }
})

// userSchema.statics.findandValidate = async function (username, password) {
//     const foundUser = await this.findOne({ username });
//     const isValid = await bcrypt.compare(password, foundUser.password);
//     return isValid ? foundUser : false;
// }
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// })


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);