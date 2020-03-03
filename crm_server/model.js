const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.connect('mongodb+srv://kendall:11Haskeken@cluster0-8bi4m.mongodb.net/CRM?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
})

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