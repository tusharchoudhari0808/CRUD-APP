<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div
      class="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 transform transition duration-500 hover:scale-105"
    >
      <!-- Page Title -->
      <h2
        class="text-4xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent tracking-wide"
      >
        Edit User
      </h2>

      <!-- Edit User Form -->
      <form @submit.prevent="updateUser" class="space-y-6">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
          <input v-model="user.first_name" type="text" placeholder="Enter first name" class="input-field" />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
          <input v-model="user.last_name" type="text" placeholder="Enter last name" class="input-field" />
        </div>

        <!-- Date of Birth -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
          <input v-model="user.dob" type="date" class="input-field" />
        </div>

        <!-- Mobile Number -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
          <input v-model="user.mobile_number" type="tel" placeholder="Enter mobile number" class="input-field" />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea v-model="user.address" rows="3" placeholder="Enter address" class="input-field"></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0">
          <button type="submit" class="btn-primary">Update</button>
          <router-link to="/users" class="btn-cancel">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ============================================================
   Imports
============================================================ */
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { AxiosResponse } from "axios";
import api from "../../axios";
import Swal from "sweetalert2";

/* ============================================================
   Type Definitions
============================================================ */
interface User {
  first_name: string;
  last_name: string;
  dob: string; 
  mobile_number: string;
  address: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/* ============================================================
   Router Setup
============================================================ */
const route = useRoute();
const router = useRouter();

// Ensure route param is valid
const userId = Number(route.params.id);
if (isNaN(userId)) throw new Error("Invalid user ID in route params");

/* ============================================================
   Reactive State
============================================================ */
const user = ref<User>({
  first_name: "",
  last_name: "",
  dob: "",
  mobile_number: "",
  address: "",
});

/* ============================================================
   API Calls
============================================================ */

// Fetch user by ID and populate form
const fetchUser = async (): Promise<void> => {
  try {
    const res: AxiosResponse<ApiResponse<User & { user_id: number }>> =
      await api.get(`/users/${userId}`, { withCredentials: true });

    const { user_id, ...userData } = res.data.data;
    user.value = userData;
  } catch (err) {
    console.error("Error fetching user:", err);
    Swal.fire({
      icon: "error",
      title: "Error fetching user",
      text: "Something went wrong!",
    });
    router.push("/users");
  }
};

// Update user with form data
const updateUser = async (): Promise<void> => {
  try {
    await api.put<ApiResponse<User>>(`/users/${userId}`, user.value, {
      withCredentials: true,
    });

    Swal.fire({
      title: "User updated successfully",
      text: "User information has been updated.",
      icon: "success",
    });

    router.push("/users");
  } catch (err) {
    console.error("Error updating user:", err);
    Swal.fire({
      title: "Failed to update user",
      text: "Something went wrong while updating.",
      icon: "error",
    });
  }
};

/* ============================================================
   Lifecycle Hooks
============================================================ */
onMounted(fetchUser);
</script>

<style scoped>
/* Reusable input styles */
.input-field {
  width: 100%;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.3s;
}
.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

/* Button Styles */
.btn-primary {
  width: 100%;
  sm:w-auto;
  background-color: #2563eb;
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s;
}
.btn-primary:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}

.btn-cancel {
  width: 100%;
  sm:w-auto;
  text-align: center;
  color: #4b5563;
  text-decoration: underline;
  transition: all 0.3s;
}
.btn-cancel:hover {
  color: #2563eb;
}
</style>
