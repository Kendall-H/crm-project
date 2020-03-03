<template>
  <nav>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer= !drawer"></v-app-bar-nav-icon>   
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Easy</span>
        <span>CRM</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="blue">
        <v-list>
            <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
                <v-list-item-action>
                    <v-icon class="white--text">{{link.icon}}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title class = white--text>{{link.text}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
    name: "NavBar",
  data() {
    return {
      drawer: false,
      links: [
          {icon: 'dashboard', text: 'Dashboard', route: '/'},
          {icon: 'people', text: 'Customers', route: '/customers'},
          {icon: 'supervisor_account', text: 'Users', route: '/users'},
          {icon: 'exit_to_app', text: 'Logout', route: '/logout'},
      ]
    }
  }
};
</script>