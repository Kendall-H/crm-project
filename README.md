### URLs
* Client - https://fathomless-brook-01467.herokuapp.com
* Server - https://fathomless-anchorage-97465.herokuapp.com 

**Customer**

###### Customer Attributes:

* firstName (string)
* lastName (string)
* email (string)
* phone (string)
* status (string)
* notes [string]
* userId User.userId

###### Customer Schema:
```javascript
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
```

### Collections:
* customers

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve customer collection   | GET    | /customers
Create new customer            | POST   | /customers
Update customer                | PUT    | /customers/*\<id\>*
Update customer note           | PUT    | /customers/*<id\>*/
Delete customer                | DELETE | /customers/*\<id\>*
