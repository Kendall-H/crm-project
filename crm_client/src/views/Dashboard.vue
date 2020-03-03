<template>
  <div class="dashboard">
    <br>
    <h1 class="display-3 font-weight-bold">Dashboard</h1>
    <br>
    <v-card class="mx-auto">
      <v-card-title class="display-3">Status</v-card-title>
      <div>
        <v-card-text class="Total display-1">Total Customers: {{totalCustomers}}</v-card-text>
        <br>
        <v-card-text class="WonStyle display-1">Won: {{customersWon}}</v-card-text> 
        <br>
        <v-card-text class="PendingStyle display-1">Pending: {{customersPending}}</v-card-text>
        <br>
        <v-card-text class="LostStyle display-1">Lost: {{customersLost}}</v-card-text>
      </div>
    </v-card>
    <v-container class="my-5"></v-container>
  </div>
</template>

<script>
// @ is an alias to /src
var fetchCustomers = function() {
  return fetch("http://localhost:3000/customers");
};

export default {
  data() {
    return {
      totalCustomers: Number,
      customersWon: 0,
      customersLost: 0,
      customersPending: 0,
      customers: [],
      greenColor: "#198833"
    };
  },
  methods: {
    showCustomers: function() {
      fetchCustomers().then(response => {
        response.json().then(myCustomers => {
          console.log("Customers List:", myCustomers);
          this.customers = myCustomers;
          this.totalCustomers = this.customers.length;
          for (var i = 0; i < this.customers.length; i++) {
            if (this.customers[i].status == "Won") {
              this.customersWon += 1;
            }
            if (this.customers[i].status == "Pending") {
              this.customersPending += 1;
            }
            if (this.customers[i].status == "Lost") {
              this.customersLost += 1;
            }
          }
        });
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
.Total{
  border-left: 4px solid #9E9E9E;
  color: #9E9E9E
}

.WonStyle{
  border-left: 4px solid #198833;
  color: #198833
}

.LostStyle{
  border-left: 4px solid #d70c0c;
  color: #d70c0c;
}

.PendingStyle{
  border-left: 4px solid #1f1fe8;
  color: #1f1fe8;
}
</style>




