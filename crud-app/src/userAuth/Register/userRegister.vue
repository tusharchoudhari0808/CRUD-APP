<template>
  <div class="max-w-4xl mx-auto p-8">
    <h2
      class="text-4xl font-extrabold mb-8 text-center 
             bg-gradient-to-r from-black to-blue-500 
             bg-clip-text text-transparent tracking-wide"
    >
      Registration
    </h2>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- Full Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Full Name</label>
        <input
          v-model="name"
          @input="validateField('name')"
          type="text"
          placeholder="Enter full name"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Email</label>
        <input
          v-model="email"
          @input="validateField('email')"
          type="email"
          placeholder="Enter email"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Password</label>
        <input
          v-model="password"
          @input="validateField('password')"
          type="password"
          placeholder="Enter password"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </p>
      </div>

      <!-- Submit -->
      <div class="md:col-span-2 text-right">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import api from "../../axios"; //  use interceptor instance

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export default defineComponent({
  name: "UserRegister",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errors: {} as Errors,
    };
  },
  methods: {
    validateField(field: keyof Errors): void {
      switch (field) {
        case "name":
          this.errors.name = !this.name.trim()
            ? "Full name is required."
            : undefined;
          break;

        case "email":
          if (!this.email.trim()) {
            this.errors.email = "Email is required.";
          } else if (!/^\S+@\S+\.\S+$/.test(this.email.trim())) {
            this.errors.email = "Invalid email format.";
          } else {
            this.errors.email = undefined;
          }
          break;

        case "password":
          if (!this.password.trim()) {
            this.errors.password = "Password is required.";
          } else if (this.password.trim().length < 8) {
            this.errors.password = "Password must be at least 8 characters.";
          } else {
            this.errors.password = undefined;
          }
          break;
      }
    },

    validateForm(): boolean {
      this.validateField("name");
      this.validateField("email");
      this.validateField("password");
      return !Object.values(this.errors).some(Boolean);
    },

    async handleSubmit(): Promise<void> {
      if (!this.validateForm()) return;

      try {
        const payload: UserPayload = {
          name: this.name.trim(),
          email: this.email.trim(),
          password: this.password.trim(),
        };

        const res = await api.post("/admin/signup", payload);

        const token = res.data?.data?.token;
        const admin = res.data?.data?.admin;

        if (token) {
          localStorage.setItem("token", token);
        }
        if (admin) {
          localStorage.setItem("admin", JSON.stringify(admin));
        }

        alert("Registration successful!");
        this.$router.push("/users"); //  go directly to dashboard
      } catch (err: any) {
        console.error("Registration error:", err);
        alert(err.response?.data?.message || "Error processing request");
      }
    },
  },
});
</script>
