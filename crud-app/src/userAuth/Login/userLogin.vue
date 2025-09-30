<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-blue-50 p-6">
    <!-- ================= Background Blobs ================= -->
    <div class="absolute inset-0 z-0">
      <div class="animated-blob blob-1"></div>
      <div class="animated-blob blob-2"></div>
    </div>

    <!-- ================= Login Card ================= -->
    <div
      class="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl transform transition duration-500 hover:scale-[1.005] z-10"
    >
      <!-- Header -->
      <h2
        class="text-4xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent tracking-wide animate-pulse-slow"
      >
        Login
      </h2>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            @input="validateField('email')"
            type="email"
            placeholder="Enter email"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            @input="validateField('password')"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 text-center">
          <button
            type="submit"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../axios";
import Swal from "sweetalert2";

// Define errors object type
interface Errors {
  email?: string;
  password?: string;
}

export default defineComponent({
  name: "LoginUser",
  setup() {
    // ================= Form State =================
    const email = ref("");
    const password = ref("");
    const errors = ref<Errors>({});
    const router = useRouter();

    // ================= Field Validation =================
    const validateField = (field: keyof Errors) => {
      switch (field) {
        case "email":
          if (!email.value.trim()) errors.value.email = "Email is required.";
          else if (!/^\S+@\S+\.\S+$/.test(email.value.trim()))
            errors.value.email = "Invalid email format.";
          else delete errors.value.email;
          break;

        case "password":
          if (!password.value.trim()) errors.value.password = "Password is required.";
          else if (password.value.trim().length < 8)
            errors.value.password = "Password must be at least 8 characters long.";
          else delete errors.value.password;
          break;
      }
    };

    const validateForm = () => {
      validateField("email");
      validateField("password");
      return Object.keys(errors.value).length === 0;
    };

    // ================= Form Submission =================
    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        const res = await api.post(
          "/admin/login",
          { email: email.value.trim(), password: password.value.trim() },
          { withCredentials: true }
        );

        const admin = res.data?.data?.admin;
        if (!admin) {
          Swal.fire({ icon: "error", title: "Login failed", text: "Admin data not found!" });
          return;
        }

        Swal.fire({ icon: "success", title: "Login successful", text: `Welcome ${admin.name}!` });
        router.push("/users");
      } catch (err: unknown) {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: (err as Error).message || "Something went wrong!",
        });
      }
    };

    return { email, password, errors, validateField, handleSubmit };
  },
});
</script>

<style scoped>
/* ================= Animated Background Blobs ================= */
@keyframes moveBlob {
  0%, 100% { transform: translate(0,0) scale(1); }
  25% { transform: translate(20px,-30px) scale(1.1); }
  50% { transform: translate(-20px,40px) scale(0.9); }
  75% { transform: translate(30px,-20px) scale(1.2); }
}

.animated-blob {
  position: absolute;
  filter: blur(100px);
  opacity: 0.6;
  border-radius: 50%;
}

.blob-1 {
  width: 400px; height: 400px;
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  top: 10%; left: 20%;
  animation: moveBlob 15s infinite ease-in-out;
}

.blob-2 {
  width: 350px; height: 350px;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  bottom: 15%; right: 25%;
  animation: moveBlob 18s infinite ease-in-out reverse;
}

/* ================= Pulse Animation ================= */
@keyframes pulse-slow {
  0%, 100% { filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0.4)); }
  50% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6)); }
}
.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}
</style>
