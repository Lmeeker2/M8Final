const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true, //this will make sure that the name is required
        unique: true //this will make sure that the name is unique
    },
    email: {
        type: String,
        required: true,
        unique: true //this will make sure that the email is unique 
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
        validator: function(el) {
            return el === this.password;
        },
        message: 'Passwords are not the same!'
    }

    },
    date: {
        type: Date,
        default: Date.now //this will automatically add the date
}
});

// this function will run before the user is saved to the database
UserSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this. confirmPassword, 10);
        this.confirmPassword = undefined // so that it does not store in the
}
next();
});
//this functions genertes the token
UserSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id: this._id}, process.env.TOKEN_SECRET_KEY);
        // this. tokens = this. tokens. concat ({token: token});
        // await this.save(Q;
        return token;
    } catch (error) {
        console.log(error);
    }
}

//this function will compare the password
UserSchema.methods.verifyPassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error ('Unable to login');
    }
    return user;

}
//
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error ('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error ('Unable to login');
    }
    return user;
}
module.exports = mongoose.model( 'User', UserSchema);
