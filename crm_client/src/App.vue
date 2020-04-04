<template>
  <v-app class="gray lighten-4">
    <div v-if="isLoggedIn == false">
      <div>
        <v-form>
          <h1 class="text-center">Easy CRM Login</h1>
          <v-container>
            <v-row class="justify-center">
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="loginEmail" label="Email:" placeholder="Email"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-text-field 
                v-model="loginPassword"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                @click:append="show1 = !show1"
                label="Password:" 
                placeholder="Password">
                </v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-dialog v-model="registerDialog" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark v-on="on">Register</v-btn>
                </template>
                <v-form ref="form" v-model="isFormValid">
                  <v-card>
                    <v-card-title>
                      <span class="headline">User Profile</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              filled
                              v-model="firstName"
                              :rules="[rules.required]"
                              label="First Name"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              filled
                              v-model="lastName"
                              :rules="[rules.required]"
                              label="Last Name"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              filled
                              v-model="email"
                              :rules="[rules.email]"
                              label="Email"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              filled
                              v-model="plainPassword"
                              :rules="[rules.required]"
                              label="Password*"
                              type="password"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="registerDialog = false">Close</v-btn>
                      <v-btn
                        :disabled="!isFormValid"
                        color="blue darken-1"
                        text
                        @click="createNewUser(firstName,lastName,email,plainPassword)"
                      >Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
              <v-btn
                @click="createUserSession(loginEmail,loginPassword)"
                class="ml-2"
                color="primary"
              >Login</v-btn>
            </div>
          </v-container>
        </v-form>
      </div>
    </div>

    <div v-else>
      <NavBar />
      <v-content class="mx-4">
        <router-view></router-view>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar";
// import Login from "@/views/Login"

let myURL = "https://fathomless-anchorage-97465.herokuapp.com/"
// let myURL = "http://localhost:3000/"

var checkSessionOnServer = function() {
  return fetch(myURL + "sessions", {
    method: "GET",
    credentials: "include",
  });
};

var createUserSessionOnServer = function(email, plainPassword) {
  var data = `&email=${encodeURIComponent(email)}`;
  data += `&plainPassword=${encodeURIComponent(plainPassword)}`;

  return fetch(myURL + "sessions", {
    body: data,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  });
};

var createNewUserOnServer = function(
  firstName,
  lastName,
  email,
  plainPassword
) {
  var data = `firstName=${encodeURIComponent(firstName)}`;
  data += `&lastName=${encodeURIComponent(lastName)}`;
  data += `&email=${encodeURIComponent(email)}`;
  data += `&plainPassword=${encodeURIComponent(plainPassword)}`;

  return fetch(myURL + "users", {
    body: data,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export default {
  name: "App",
  components: {
    NavBar
  },
  data() {
    return {
      show1: false,
      firstName: "",
      lastName: "",
      email: "",
      plainPassword: "",
      loginPassword: "",
      loginEmail: "",
      isLoggedIn: false,
      registerDialog: false,
      isFormValid: false,
      rules: {
        required: value => !!value || "Required.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
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

    checkSession: function() {
      checkSessionOnServer().then(response => {
        if(response.status == 201){
        this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })  
    },

    createUserSession: function(loginEmail, loginPassword) {
      createUserSessionOnServer(loginEmail, loginPassword).then(response => {
        if (response.status == 201) {
          localStorage.setItem("cookie", response.cookie);
          this.isLoggedIn = true;
        } else {
          alert("Incorrect credentials")
        }
      });
    },

    createNewUser: function(firstName, lastName, email, plainPassword) {
      createNewUserOnServer(firstName, lastName, email, plainPassword).then(
        response => {
          console.log(response.status);
          if (response.status == 201) {
            this.registerDialog = false;
            (this.firstName = ""),
              (this.lastName = ""),
              (this.email = ""),
              (this.plainPassword = ""),
              this.reset;
          } else {
            alert("Email in use");
          }
        }
      );
    }

    
  },
  beforeMount() {
    console.log("Vue loaded!");
    this.checkSession();
  }
};
</script>
