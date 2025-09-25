<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden p-6">
    <div class="absolute inset-0 z-0">
      <div class="animated-blob blob-1"></div>
      <div class="animated-blob blob-2"></div>
    </div>

    <div
      class="relative w-full max-w-md p-8 bg-white/10 shadow-lg rounded-3xl backdrop-filter backdrop-blur-lg border border-white/20 transform transition duration-500 hover:scale-105 z-10"
    >
      <h2
        class="text-4xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent tracking-wide"
      >
        Login
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-200 mb-2">Email</label>
          <input
            v-model="email"
            @input="validateField('email')"
            type="email"
            placeholder="Enter email"
            class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition duration-300"
          />
          <p v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-200 mb-2">Password</label>
          <input
            v-model="password"
            @input="validateField('password')"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition duration-300"
          />
          <p v-if="errors.password" class="text-red-400 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div class="mt-8 text-center">
          <button
            type="submit"
            class="w-full font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import api from "../../axios";
import Swal from "sweetalert2";

interface Errors {
  email?: string;
  password?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    admin?: {
      admin_id: number;
      email: string;
      name: string;
    };
  };
}

export default defineComponent({
  name: "LoginUser",
  data() {
    return {
      email: "",
      password: "",
      errors: {} as Errors,
    };
  },
  methods: {
    validateField(field: keyof Errors): void {
      switch (field) {
        case "email":
          if (!this.email.trim()) this.errors.email = "Email is required.";
          else if (!/^\S+@\S+\.\S+$/.test(this.email.trim()))
            this.errors.email = "Invalid email format.";
          else delete this.errors.email;
          break;
        case "password":
          if (!this.password.trim()) this.errors.password = "Password is required.";
          else if (this.password.trim().length < 8)
            this.errors.password = "Password must be at least 8 characters long.";
          else delete this.errors.password;
          break;
      }
    },

    validateForm(): boolean {
      this.validateField("email");
      this.validateField("password");
      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit(): Promise<void> {
      if (!this.validateForm()) return;

      try {
        const payload: LoginPayload = {
          email: this.email.trim(),
          password: this.password.trim(),
        };

        // Send login request (cookie-based JWT)
        const res = await api.post<LoginResponse>("/admin/login", payload, {
          withCredentials: true,
        });

        const admin = res.data?.data?.admin;

        if (!admin) {
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: "Admin data not found in response!",
          });
          return;
        }

        Swal.fire({
          title: "Login successful",
          text: `Welcome ${admin.name || "Admin"}!`,
          icon: "success",
        });

        // Redirect to protected page
        this.$router.push("/users");
      } catch (err: unknown) {
        let message = "Something went wrong!";
        if (err instanceof Error) message = err.message;

        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: message,
        });
        console.error(err);
      }
    },
  },
});
</script>

<style scoped>
@keyframes moveBlob {
  0%,100% { transform: translate(0,0) scale(1); }
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
</style>
