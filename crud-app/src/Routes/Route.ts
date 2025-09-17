import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Components
import UserList from "../components/List/UserList.vue";
import UserForm from "../components/Form/CreateUsers.vue";
import EditUser from "../components/Edit/editUser.vue";
import UserLogin from "../userAuth/Login/userLogin.vue";
import UserRegister from "../userAuth/Register/userRegister.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/users" },

  // Public route → users list always accessible
  {
    path: "/users",
    name: "UserList",
    component: UserList,
    meta: { requiresAuth: false }, 
  },

  // Protected routes
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

  // Public routes
  { path: "/login", name: "Login", component: UserLogin },
  { path: "/register", name: "Register", component: UserRegister },

  { path: "/:pathMatch(.*)*", redirect: "/users" },
];

 const router = createRouter({
  history: createWebHistory(),
     routes,
 });

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const requiresAuth = to.meta.requiresAuth as boolean;

  if (requiresAuth && !token) {
    // not logged in but trying to access protected route
    next("/login");
  } else {
    next();
  }
});








// Define routes
// const routes: Array<RouteRecordRaw> = [
//   { path: "/", redirect: "/users" },

//   // Protected routes
//   {
//     path: "/users",
//     name: "UserList",
//     component: UserList,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/create",
//     name: "CreateUser",
//     component: UserForm,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/users/:id/edit",
//     name: "EditUser",
//     component: EditUser,
//     props: (route) => ({ id: Number(route.params.id) }),
//     meta: { requiresAuth: true },
//   },

//   // Public routes
//   { path: "/login", name: "Login", component: UserLogin },
//   { path: "/register", name: "Register", component: UserRegister },

//   // Catch-all route (404)
//   { path: "/:pathMatch(.*)*", redirect: "/login" },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// // Global navigation guard
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem("token");
//   const requiresAuth = (to.meta as any).requiresAuth as boolean; // cast to boolean

//   if (requiresAuth && !token) {
//     next("/login"); // redirect if not logged in
//   } else if ((to.path === "/login" || to.path === "/register") && token) {
//     next("/users"); // prevent going back to login/register when already logged in
//   } else {
//     next();
//   }
// });

export default router;
