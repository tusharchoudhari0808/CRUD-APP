<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div
      class="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 transform transition duration-500 hover:scale-105"
    >
      <h2
        class="text-4xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent tracking-wide"
      >
        Edit User
      </h2>

      <form @submit.prevent="updateUser" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >First Name</label
          >
          <input
            v-model="user.first_name"
            type="text"
            placeholder="Enter first name"
            class="w-full border-2 border-gray-300 rounded-lg p-3 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Last Name</label
          >
          <input
            v-model="user.last_name"
            type="text"
            placeholder="Enter last name"
            class="w-full border-2 border-gray-300 rounded-lg p-3 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Date of Birth</label
          >
          <input
            v-model="user.dob"
            type="date"
            class="w-full border-2 border-gray-300 rounded-lg p-3 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Mobile Number</label
          >
          <input
            v-model="user.mobile_number"
            type="tel"
            placeholder="Enter mobile number"
            class="w-full border-2 border-gray-300 rounded-lg p-3 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Address</label
          >
          <textarea
            v-model="user.address"
            rows="3"
            placeholder="Enter address"
            class="w-full border-2 border-gray-300 rounded-lg p-3 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          ></textarea>
        </div>

        <div
          class="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0"
        >
          <button
            type="submit"
            class="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
          >
            Update
          </button>
          <router-link
            to="/users"
            class="w-full sm:w-auto text-center text-gray-600 hover:text-blue-600 font-medium transition duration-300 underline"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import api from "../../axios";
import Swal from "sweetalert2";

interface User {
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

export default defineComponent({
  name: "EditUser",
  data() {
    return {
      user: {
        first_name: "",
        last_name: "",
        dob: "",
        mobile_number: "",
        address: "",
      } as User,
      userId: Number(this.$route.params.id),
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await api.get(`/users/${this.userId}`, {
          withCredentials: true, // send cookie
        });

        // Destructure and remove user_id
        const { user_id, ...userData } = res.data.data;
        this.user = userData;

      } catch (err) {
        console.error("Error fetching user:", err);
        Swal.fire({
          icon: "error",
          title: "Error fetching user",
          text: "Something went wrong!",
        });
        this.$router.push("/users");
      }
    },

    async updateUser() {
      try {
        // Send only allowed fields (no user_id)
        await api.put(`/users/${this.userId}`, this.user, {
          withCredentials: true,
        });

        Swal.fire({
          title: "User updated successfully",
          text: "User information has been updated.",
          icon: "success",
        });

        this.$router.push("/users");
      } catch (err) {
        console.error("Error updating user:", err);
        Swal.fire({
          title: "Failed to update user",
          text: "Something went wrong while updating.",
          icon: "error",
        });
      }
    },
  },
});
</script>


