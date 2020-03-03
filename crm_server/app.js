const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const model = require('./model')

const app = express();
const port = process.env.PORT || 3000;
// const port = process.env.PORT

/////// MIDDLEWARE ///////
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


////// CUSTOMER REQUESTS //////
app.get('/customers', function (req, res){
    // res.set("Access-Control-Allow-Origin", "*");
    model.Customer.find({}).then(function (customers){
        res.json(customers);
    });
});
app.get('/customers/:customerId', function (req, res){
    // res.set("Access-Control-Allow-Origin", "*");
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
    // res.set("Access-Control-Allow-Origin", "*");
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
        // res.set('Access-Control-Allow-Origin', '*');
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
app.get('/users', function (req, res){
    // res.set("Access-Control-Allow-Origin", "*");
    model.User.find({}).then(function (users){
        res.json(users);
    });
});

app.post('/users', function (req, res) {
    // res.set("Access-Control-Allow-Origin", "*");

    let user = new model.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })
    user.save().then(function () {
        // res.set('Access-Control-Allow-Origin', '*');
        res.sendStatus(201);
    });
});

app.listen(port, function () { 
    console.log(`App listening on port ${port}!`)
});

