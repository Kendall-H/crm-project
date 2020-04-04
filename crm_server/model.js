const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://kendall:11Haskeken@cluster0-8bi4m.mongodb.net/CRM?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = Schema({
    firstName: {
        type: String,
        required: true,  
    },
    lastName: {
        type: String,
        required: true,  
    },
    email: {
        type: String,
        required: true,
        unique: true,  
    },
    encryptedPassword: {
        type: String,
        required: true,  
    },
});

userSchema.methods.setEncryptedPassword = function (plainPassword, callBackFunction) {
    // "this" user instance
    bcrypt.hash(plainPassword, 12).then(hash => {
        this.encryptedPassword = hash;
        callBackFunction();
    });
};

userSchema.methods.verifyPassword = function (plainPassword, callBackFunction) {
    bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
        callBackFunction(result);
    });
}

const customerSchema = Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    notes: [String],
    status: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
})

const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);

module.exports = {
    User: User,
    Customer: Customer
}