<template>
  <v-app>
    <v-container class="my-6">
      <h1>Customers</h1>
      <v-dialog persistent v-model="createDialog" max-width="800">
        <template v-slot:activator="{ on }">
          <div class="text-right text--justify pb-4">
            <v-btn dark color="blue">
              <v-icon v-on="on" large>mdi-plus</v-icon>
            </v-btn>
          </div>
        </template>
        <v-form ref="form" v-model="isFormValid">
          <v-card class="justify-center">
            <v-card-title class="justify-center">Create a new customer</v-card-title>
            <v-card-subtitle class="text-left">* Required</v-card-subtitle>
            <v-text-field
              v-model="newFirstName"
              :rules="[rules.required]"
              label="*First name:"
              filled
            ></v-text-field>
            <v-text-field
              v-model="newLastName"
              :rules="[rules.required]"
              label="*Last name:"
              filled
            ></v-text-field>
            <v-text-field
              v-model="newEmail"
              :rules="[rules.required, rules.email]"
              label="*Email:"
              filled
            ></v-text-field>
            <v-text-field v-model="newPhone" :rules="[rules.required]" label="*Phone:" filled></v-text-field>
            <v-text-field v-model="newNote" label="Note:" filled></v-text-field>
            <v-card-actions class="justify-center">
              <v-btn
                class="white--text"
                color="blue"
                :disabled="!isFormValid"
                @click="createNewCustomer()"
              >Submit</v-btn>
            </v-card-actions>
            <v-card-actions class="justify-center">
              <v-btn text color="red" @click="resetValidation, createDialog=false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-container style="max-height: 600px" class="overflow-x-auto">
        <v-card class="mb-3" v-for="customer of customers" :key="customer._id">
          <v-layout row wrap :class="`pa-3 customer ${customer.status}`">
            <v-flex xs10 md3>
              <div class="grey--text">Customer Name</div>
              <div>{{customer.firstName}} {{customer.lastName}}</div>
            </v-flex>
            <v-flex xs5 sm4 md2>
              <div class="grey--text">Email</div>
              <div>{{customer.email}}</div>
            </v-flex>
            <v-flex xs5 sm4 md2>
              <div class="grey--text">Phone</div>
              <div>{{customer.phone}}</div>
            </v-flex>
            <v-flex xs2 sm4 md2>
              <div class="grey--text">Status</div>
              <div>{{customer.status}}</div>
            </v-flex>
            <v-flex xs2 sm4 md2>
              <v-dialog v-model="customer.editDialog" :retain-focus="false" max-width="800px">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on">Edit</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span>Customer Edit</span>
                  </v-card-title>
                  <v-text-field class="pl-2" label="First Name:" v-model="customer.firstName"></v-text-field>
                  <v-text-field class="pl-2" label="Last Name:" v-model="customer.lastName"></v-text-field>
                  <v-text-field class="pl-2" label="Email:" v-model="customer.email"></v-text-field>
                  <v-text-field class="pl-2" label="Phone:" v-model="customer.phone"></v-text-field>
                  <span class="ml-2">Status:</span>
                  <v-overflow-btn :items="status_options" label="Status" v-model="customer.status"></v-overflow-btn>
                  <v-card-actions class="justify-center">
                    <v-btn
                      @click="customer.editDialog=false, editExistingCustomer(customer._id, customer.firstName, customer.lastName, customer.email, customer.phone, customer.status)"
                      class="justify-center"
                      dark
                      color="blue"
                    >Save</v-btn>
                    <v-btn @click="customer.editDialog=false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="customer.deleteDialog" max-width="500">
                <template v-slot:activator="{ on }">
                  <v-flex xs2 sm4 md2>
                    <v-btn v-on="on" class="mb-6 mt-3">Delete</v-btn>
                  </v-flex>
                </template>
                <v-card>
                  <v-card-title class="justify-center">
                    <span
                      class="red--text"
                    >Are you sure you want to delete {{customer.firstName}} {{customer.lastName}}?</span>
                  </v-card-title>
                  <v-card-actions class="justify-center">
                    <v-btn
                      @click="customer.deleteDialog=false, deleteCustomer(customer._id)"
                    >Confirm</v-btn>
                    <v-btn @click="customer.deleteDialog=false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-flex>
            <div class="pt-12 mr-2">
              <v-form v-model="customer.isNoteFormValid" ref="form">
                <v-text-field
                  :rules="[rules.required]"
                  label="New Note"
                  v-model="customer.addedNote"
                ></v-text-field>
                <v-btn
                  small
                  class="ml-8 white--text"
                  color="blue"
                  :disabled="!customer.isNoteFormValid"
                  @click="addNewNote(customer._id,customer.addedNote)"> Add Note</v-btn>
              </v-form>
            </div>
            <div>
              <header class="grey--text pt-2 title">Customer Notes:</header>
              <v-list style="max-height:200px" class="overflow-x-auto">
                <v-list-item v-for="note in customer.notes" :key="note.id">
                  <p class="overflow-y-auto">
                    {{note}}
                    <v-btn
                      small
                      text
                      fab
                      @click="deleteNote(customer._id, customer.notes.indexOf(note))"
                    >
                      <v-icon color="red">remove_circle</v-icon>
                    </v-btn>
                  </p>
                </v-list-item>
              </v-list>
            </div>
          </v-layout>
          <v-divider></v-divider>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>
<script>
// @ is an alias to /src
// import EditCustomer from "@/components/EditCustomer";
var createNewCustomerOnServer = function(
  newFirstName,
  newLastName,
  newEmail,
  newPhone,
  newNote,
  newStatus
) {
  var data = `firstName=${encodeURIComponent(newFirstName)}`;
  data += `&lastName=${encodeURIComponent(newLastName)}`;
  data += `&email=${encodeURIComponent(newEmail)}`;
  data += `&phone=${encodeURIComponent(newPhone)}`;
  data += `&notes=${encodeURIComponent(newNote)}`;
  data += `&status=${encodeURIComponent(newStatus)}`;

  return fetch("https://fathomless-anchorage-97465.herokuapp.com/customers", {
    body: data,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Security-Policy": "https://fonts.googleapis.com/"
    }
  });
};

var editCustomerOnServer = function(
  customerId,
  customerFirstName,
  customerLastName,
  customerEmail,
  customerPhone,
  customerStatus
) {
  var data = `firstName=${encodeURIComponent(customerFirstName)}`;
  data += `&lastName=${encodeURIComponent(customerLastName)}`;
  data += `&email=${encodeURIComponent(customerEmail)}`;
  data += `&phone=${encodeURIComponent(customerPhone)}`;
  data += `&status=${encodeURIComponent(customerStatus)}`;

  return fetch("https://fathomless-anchorage-97465.herokuapp.com/customers" + "/" + customerId, {
    body: data,
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var addNewNoteOnServer = function(customerId, newNote) {
  var data = `note=${encodeURIComponent(newNote)}`;
  return fetch(
    "https://fathomless-anchorage-97465.herokuapp.com/customers" + "/" + customerId + "/" + "notes",
    {
      body: data,
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
};

var deleteCustomer = function(customerId) {
  return fetch("https://fathomless-anchorage-97465.herokuapp.com/customers" + "/" + customerId, {
    method: "DELETE"
  });
};

var deleteCustomerNote = function(customerId, noteId) {
  return fetch(
    "https://fathomless-anchorage-97465.herokuapp.com/customers" + "/" + customerId + "/" + noteId,
    {
      method: "DELETE"
    }
  );
};

var fetchCustomers = function() {
  return fetch("https://fathomless-anchorage-97465.herokuapp.com/customers", {
    method: "GET",
    headers: {
      "Content-Security-Policy": "default-src "*" "
    }
  });
};

export default {
  data() {
    return {
      ///// New customer variables /////
      newFirstName: "",
      newLastName: "",
      newEmail: "",
      newPhone: "",
      newNote: "",
      addedNote: "",
      newStatus: "Pending",
      isFormValid: false,
      isNoteFormValid: false,
      rules: {
        required: value => !!value || "Required.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      ///// New customer variables /////
      noteButton: false,
      createDialog: false,
      deleteDialog: false,
      editDialog: false,
      status_options: ["Won", "Lost", "Pending"],
      customers: [],
      totalCustomers: Number
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    reset() {
      this.$refs.form.reset();
      console.log(this.formObject);
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    showCustomers: function() {
      fetchCustomers().then(response => {
        response.json().then(myCustomers => {
          console.log("Customers List:", myCustomers);
          this.customers = myCustomers;
          this.totalCustomers = this.customers.length;
        });
      });
    },
    deleteNote: function(customerId, noteId) {
      deleteCustomerNote(customerId, noteId).then(response => {
        if (response.status == 202) {
          this.showCustomers();
        }
      });
    },
    addNewNote: function(customerId, note) {
      addNewNoteOnServer(customerId, note).then(response => {
        if (response.status == 202) {
          this.reset;
          this.showCustomers();
        }
      });
    },

    deleteCustomer: function(customerId) {
      deleteCustomer(customerId).then(response => {
        if (response.status == 200) {
          this.showCustomers();
        }
      });
    },

    checkEmail: function(email) {
      var value = false
      for (var i = 0; i < this.customers.length; i) {
        if (email == this.customers[i].email){
          return true;
        } else {
          value = false;
        }
        return value;
      }

    },

    createNewCustomer: function() {
      
      createNewCustomerOnServer(
        this.newFirstName,
        this.newLastName,
        this.newEmail,
        this.newPhone,
        this.newNote,
        this.newStatus
      ).then(response => {
        if (response.status == 201) {
          this.resetValidation;
          this.createDialog = false;
          (this.newFirstName = ""),
            (this.newLastName = ""),
            (this.newEmail = ""),
            (this.newPhone = ""),
            (this.newNote = ""),
            this.reset;
            this.showCustomers();
        }
      });
    },
    editExistingCustomer: function(
      customerId,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      customerStatus
    ) {
      editCustomerOnServer(
        customerId,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhone,
        customerStatus
      ).then(response => {
        if (response.status == 202) {
          this.showCustomers();
        }
      });
    }
  },
  created: function() {
    console.log("Vue loaded!");
    this.showCustomers();
  }
};
</script>

<style>
.customer.Won {
  border-left: 4px solid #198833;
}
.customer.Lost {
  border-left: 4px solid #d70c0c;
}
.customer.Pending {
  border-left: 4px solid #1f1fe8;
}
</style>
