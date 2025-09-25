<template>
  <nav class="bg-gray-900 text-white p-4 flex gap-6 sm:gap-8 justify-center sm:justify-start shadow-lg">
    <!-- Protected links -->
    <router-link
      v-if="isLoggedIn"
      to="/users"
      class="text-lg font-semibold hover:text-blue-400 transition"
      active-class="text-teal-400"
    >
      User List
    </router-link>

    <router-link
      v-if="isLoggedIn"
      to="/create"
      class="text-lg font-semibold hover:text-blue-400 transition"
      active-class="text-teal-400"
    >
      Add User
    </router-link>

    <!-- Public link -->
    <router-link
      v-if="!isLoggedIn"
      to="/login"
      class="text-lg font-semibold hover:text-blue-400 transition"
      active-class="text-teal-400"
    >
      Login
    </router-link>
  </nav>

  <main class="p-6">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "./axios";

const isLoggedIn = ref(false);

// Check login status via backend cookie
async function checkLogin() {
  try {
    // Call the verify route to check if cookie is valid
    const res = await api.get("/admin/verify", { withCredentials: true });
    isLoggedIn.value = !!res.data?.admin; // true if admin info exists
  } catch {
    isLoggedIn.value = false; // cookie invalid or not logged in
  }
}

// Run on component mount
onMounted(() => {
  checkLogin();
});
</script>
