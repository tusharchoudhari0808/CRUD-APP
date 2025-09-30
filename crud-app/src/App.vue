<template>
  <!-- ================= Navigation Bar ================= -->
  <nav class="bg-gray-900 text-white p-4 flex gap-6 sm:gap-8 justify-center sm:justify-start shadow-lg">
    
    <!-- Protected links (visible only when logged in) -->
    <router-link
      v-if="!isLoading && isLoggedIn"
      to="/users"
      class="text-lg font-semibold hover:text-blue-400 transition"
      active-class="text-teal-400"
    >
      User List
    </router-link>

    <router-link
      v-if="!isLoading && isLoggedIn && isRole_id === 1" 
      to="/create"
      class="text-lg font-semibold hover:text-blue-400 transition"
      active-class="text-teal-400"
    >
      Add User
    </router-link>

    <!-- Public link (visible when not logged in) -->
    <router-link
      v-if="!isLoading && !isLoggedIn"
      to="/login"
      class="text-lg font-semibold hover:text-blue-400 transition"
      active-class="text-teal-400"
    >
      Login
    </router-link>
  </nav>

  <!-- ================= Main Content ================= -->
  <main class="p-6">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "./axios";

export default defineComponent({
  name: "AppLayout",
  setup() {
    // ================= State Variables =================
    const isLoggedIn = ref(false); // track login status
    const isRole_id = ref<number>(0); // track user role
    const isLoading = ref(true); // track async loading of login status

    // ================= Check Login Status =================
    const checkLogin = async () => {
      try {
        const res = await api.get("/admin/verify", { withCredentials: true });
        isLoggedIn.value = !!res.data?.admin; // true if admin exists
        isRole_id.value = res.data.admin.role_id; // role id from backend
      } catch {
        isLoggedIn.value = false; // not logged in
        isRole_id.value = 0; // reset role
      } finally {
        isLoading.value = false; // stop loading spinner
      }
    };

    // ================= Lifecycle Hook =================
    onMounted(() => {
      checkLogin(); // check login on component mount
    });

    return {
      isLoggedIn,
      isRole_id,
      isLoading, // expose loading flag for template
    };
  },
});
</script>
