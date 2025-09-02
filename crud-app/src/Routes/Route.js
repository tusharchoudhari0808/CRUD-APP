import { createRouter, createWebHistory } from 'vue-router'

// Components
import UserList from '../components/List/UserList.vue'
import UserForm from '../components/Form/CreateUsers.vue'
import EditUser from '../components/Edit/EditUser.vue'

const routes = [
  { path: '/', redirect: '/users' }, // redirect root to /users

  // Users routes
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/create',
    name: 'CreateUser',
    component: UserForm
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: EditUser,
    props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
