import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard'
import Customers from '../views/Customers'
import Users  from '../views/Users'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/customers',
    name: 'customers',
    component: Customers,
  },
  { 
    path: '/users',
    name: 'users',
    component: Users
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
