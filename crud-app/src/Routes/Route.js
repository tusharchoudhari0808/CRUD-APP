import { createRouter, createWebHistory } from 'vue-router';
import UserList from '../components/List/UserList.vue';
import CreateUser from '../components/Form/CreateUsers.vue';

const routes = [
  // { path: '/', redirect: '/users' },
   { path: '/',redirect:'/users' }, // redirect root to user list
  { path: '/users', component: UserList },
  { 
    path: '/create/:id?', // optional id for edit
    name: 'CreateUser',
    component: CreateUser,
    props: true // pass :id as prop
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
