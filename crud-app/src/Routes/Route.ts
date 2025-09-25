import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import api from "../axios";

// Components
import UserList from "../components/List/UserList.vue";
import UserForm from "../components/Form/CreateUsers.vue";
import EditUser from "../components/Edit/editUser.vue";
import UserLogin from "../userAuth/Login/userLogin.vue";
//import Logout from "../userAuth/Logout.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },

  // Protected routes
  {
    path: "/users",
    name: "UserList",
    component: UserList,
    meta: { requiresAuth: true },
  },
  {
    path: "/create",
    name: "CreateUser",
    component: UserForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/users/:id/edit",
    name: "EditUser",
    component: EditUser,
    props: (route) => ({ id: Number(route.params.id) }),
    meta: { requiresAuth: true },
  },

//  {
//   path: "/logout",
//   name: "Logout",
//   component: Logout,
//   meta: { requiresAuth: true }
// },


  

  // Public route
  { path: "/login", name: "Login", component: UserLogin },

  { path: "/:pathMatch(.*)*", redirect: "/users" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Router guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth as boolean;

  if (requiresAuth) {
    // Protected route: check cookie by hitting backend
    try {
      await api.get("/users", { withCredentials: true });
      return next();
    } catch {
      return next("/login");
    }
  } else if (to.path === "/login") {
    // Login page: if already logged in, redirect to /users
    try {
      await api.get("/users", { withCredentials: true });
      return next("/users");
    } catch {
      return next(); // Not logged in, allow login
    }
  } else {
    return next(); // Public route
  }
});

export default router;
