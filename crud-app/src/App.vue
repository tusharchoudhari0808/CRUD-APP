<template>
  <!-- Navbar -->
  <nav class="bg-gray-800 text-white p-4 flex gap-6">
    <router-link
      to="/users"
      class="hover:text-gray-300"
      active-class="text-yellow-400"
    >
      User List
    </router-link>
    <router-link
      to="/create"
      class="hover:text-gray-300"
      active-class="text-yellow-400"
    >
      Add User
    </router-link>
    <!-- Show Login only if not logged in -->
    <router-link
      v-if="!isLoggedIn"
      to="/login"
      class="hover:text-gray-300"
      active-class="text-yellow-400"
    >
      Login
    </router-link>
  </nav>

  <!-- Routed pages -->
  <main class="p-6">
    <router-view />
  </main>

 
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { isTokenExpired, autoLogoutAtExpiry } from "./utils/auth";

const isLoggedIn = ref(false);

onMounted(() => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    isLoggedIn.value = false;
  } else {
    isLoggedIn.value = true;
    autoLogoutAtExpiry(token); 
  }
});
</script>
