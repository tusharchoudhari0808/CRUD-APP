<!-- <template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 class="text-2xl font-bold mb-4">Logging out...</h2>
      <p class="text-gray-600">Please wait while we log you out.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import api from "../axios";

export default defineComponent({
  name: "Logout",
  setup(_, { emit }) {
    onMounted(async () => {
      try {
        await api.post("/logout", {}, { withCredentials: true }); // call backend
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        window.location.href = "/login"; // force redirect
      } catch (err) {
        console.error("Error logging out:", err);
        window.location.href = "/login";
      }
    });

    return {};
  },
});
</script> -->
