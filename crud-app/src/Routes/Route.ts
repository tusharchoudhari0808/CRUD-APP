import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import api from "../axios";

// Components
import UserList from "../components/List/UserList.vue";
import UserForm from "../components/Form/CreateUsers.vue";
import EditUser from "../components/Edit/editUser.vue";
import UserLogin from "../userAuth/Login/userLogin.vue";

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
    try {
      await api.get("/admin/verify", { withCredentials: true });
      return next();
    } catch {
      return next("/login");
    }
  } else if (to.path === "/login") {
    try {
      await api.get("/admin/verify", { withCredentials: true });
      return next("/users");
    } catch {
      return next();
    }
  } else {
    return next();
  }
});

export default router;
