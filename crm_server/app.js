const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');

// const csp = require('express-csp-header');


const model = require('./model')

const app = express();
const port = process.env.PORT || 3000;
// const port = process.env.PORT

/////// MIDDLEWARE ///////

app.use(bodyParser.urlencoded({extended: false}));
// app.use(cors())
app.use(cors({ credentials: true, origin: 'https://fathomless-brook-01467.herokuapp.com' })); 
app.use(session({ secret: 'gfdsgkfdhgbcvmcmleidbgfgfg', resave: false, saveUninitialized: true, cookie : {maxAge: 6000000000}}))
app.use(passport.initialize());
app.use(passport.session());

// app.use(csp({
//     policies: {
//         'default-src': ["*"],
//         'script-src': ["*"],
//         'font-src': ["*"],
//         'style-src-elem': ["*"],
//         'img-src': ["*"],
//     }
// }));

//Passport Configuration
passport.use(new passportLocal.Strategy({ 
    //Configurations
    usernameField: "email",
    passwordField: "plainPassword",
 }, function(email, plainPassword, done) {

    // Authentication Algorithm
    model.User.findOne({email: email}).then(function(user) {
        // If user does not exist
        if (!user) {
            // return failure
            return done(null, false);
        // If user exists
        } else { 
            //[async] compare given password to hash
            user.verifyPassword(plainPassword, function(result) {
                // If password matches
                if (result) {
                    //return success
                    return done(null, user);
                // If password does not match
                } else {
                    //return failure
                    return done(null, false);
                }
            })
        }
    }) .catch(function(err) {
        // some error occurred
        done(err);
    })
}));

// Passport serialization and deserialization
passport.serializeUser(function(user, done) {
    // Called when user authenticated
    // Save users ID into session
    done(null, user._id);
})

passport.deserializeUser(function(userId, done) {
    // called before any requests after authentication
    // read userID from session
    model.User.findOne({_id: userId}). then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err);
    });
});

// RESTful authentication route
app.post('/sessions', passport.authenticate('local'), function(req, res){
    // User authenticated and logged in
    // console.log(res)
    res.sendStatus(201);
})

app.get('/sessions', function(req, res) {
    if (req.user) {
        res.sendStatus(201);
    } else {
        res.sendStatus(401);
    }
})

////// CUSTOMER REQUESTS //////
app.get('/customers', function (req, res){
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    console.log("user", req.user);
    model.Customer.find({}).then(function (customers){
        res.json(customers);
    });
});

app.get('/customers/:customerId', function (req, res){
    let customerId = req.params.customerId;
    model.Customer.findOne({_id: customerId}).then(function (customer){
        res.json(customer);
    });
});

app.put('/customers/:customerId/notes', function (req, res){
    
    let customerId = req.params.customerId;
    let newNote = String(req.body.note)
    model.Customer.findById({_id: customerId}).then(function (customer){
        customer.notes.push(String(newNote));
        customer.save().then(function (){
            res.sendStatus(202)
        })
    }) 
})

app.put('/customers/:customerId', function (req, res) {
    let customerId = req.params.customerId
    model.Customer.findById({_id: customerId}).then(function (customer){
        customer.firstName = req.body.firstName,
        customer.lastName = req.body.lastName,
        customer.email = req.body.email,
        customer.phone = req.body.phone,
        customer.status = req.body.status,
        customer.save().then(function (){
            res.sendStatus(202)
        })
    })
});

app.post('/customers', function (req, res) {

    if (!req.user) {
        res.sendStatus(401);
        return;
    }

    let customer = new model.Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        notes: req.body.notes,
        status: req.body.status,
        userId: req.body.userId
    })
    customer.save().then(function () {
        res.sendStatus(201);
    }).catch(function (err) {
        if (err.errors){
            var messages = {};
        for (let e in err.errors) {
            messages[e] = err.errors[e].message
        }
        res.status(422).json(messages);
        } else {
            sendStatus(500);
        }
    })
});

app.delete('/customers/:customerId', function (req, res) {
    
    let customerId = req.params.customerId;
    model.Customer.findOneAndDelete({_id: customerId}).then(function (customer) {
        if(customer){
            res.json(customer)
        } else {
            res.sendStatus(404);
        }
    //Sends a 400 status if the id is not correctly formatted
    }, function(err){
        res.sendStatus(400);
    });
});

app.delete('/customers/:customerId/:noteId', function (req, res){

    let customerId = req.params.customerId;
    let noteId = req.params.noteId;
    console.log(noteId);
    model.Customer.findById({_id: customerId}).then(function (customer){
        customer.notes.splice(noteId,1)
        customer.save().then(function (){
            res.sendStatus(202)
        })
    }) 
})

///////////////// USER REQUESTS //////////////

app.post('/users', function (req, res) {
    let user = new model.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        encryptedPassword: req.body.plainPassword,
    });
    
    user.setEncryptedPassword(req.body.plainPassword, function (){
        user.save().then(function () {
            res.sendStatus(201);
        }).catch(function (err) {
            if (err.errors) {
                var messages = {};
                for (let e in err.errors) {
                    messages[e] = err.errors[e].message;
                }
                res.status(422).json(messages);
            } else {
                res.sendStatus(500);
            }
        })
    });
});

app.listen(port, function () { 
    console.log(`App listening on port ${port}!`)
});

