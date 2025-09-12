import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Components
import UserList from "../components/List/UserList.vue";
import UserForm from "../components/Form/CreateUsers.vue";
import EditUser from "../components/Edit/editUser.vue";

// Define routes type-safe
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/users" },

  {
    path: "/users",
    name: "UserList",
    component: UserList,
  },
  {
    path: "/create",
    name: "CreateUser",
    component: UserForm,
  },
  {
    path: "/users/:id/edit",
    name: "EditUser",
    component: EditUser,
    props: true, // pass route params as props
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
