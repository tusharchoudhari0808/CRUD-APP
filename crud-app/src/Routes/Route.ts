import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import api from "../axios";

// ================= Components =================
import UserList from "../components/List/UserList.vue";
import UserForm from "../components/Form/CreateUsers.vue";
import EditUser from "../components/Edit/editUser.vue";
import UserLogin from "../userAuth/Login/userLogin.vue";

// ================= Route Definitions =================
const routes: Array<RouteRecordRaw> = [
  // Default redirect
  { path: "/", redirect: "/login" },

  // ---------------- Protected Routes ----------------
  {
    path: "/users",
    name: "UserList",
    component: UserList,
    meta: { requiresAuth: true }, // only accessible if logged in
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
    props: (route) => ({ id: Number(route.params.id) }), // pass ID as prop
    meta: { requiresAuth: true },
  },

  // ---------------- Public Routes ----------------
  {
    path: "/login",
    name: "Login",
    component: UserLogin,
  },

  // Catch-all route: redirect unknown paths to users
  { path: "/:pathMatch(.*)*", redirect: "/users" },
];

// ================= Router Instance =================
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ================= Navigation Guards =================
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth as boolean;

  // Check protected routes
  if (requiresAuth) {
    try {
      await api.get("/admin/verify", { withCredentials: true });
      next(); // user authenticated, proceed
    } catch {
      next("/login"); // not authenticated, redirect to login
    }
  }
  // Redirect logged-in users away from login page
  else if (to.path === "/login") {
    try {
      await api.get("/admin/verify", { withCredentials: true });
      next("/users"); // already logged in, redirect to user list
    } catch {
      next(); // not logged in, allow access to login
    }
  }
  // Public routes with no auth required
  else {
    next();
  }
});

export default router;
