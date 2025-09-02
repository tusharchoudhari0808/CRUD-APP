<template>
  <div class="p-6 max-w-lg mx-auto bg-white shadow rounded-2xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-700 text-center"> Edit User</h2>

    <form @submit.prevent="updateUser" class="space-y-4">
      <!-- First Name -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">First Name</label>
        <input
          v-model="user.firstName"
          type="text"
          placeholder="Enter first name"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
        <input
          v-model="user.lastName"
          type="text"
          placeholder="Enter last name"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- DOB -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
        <input
          v-model="user.dob"
          type="date"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Mobile -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
        <input
          v-model="user.mobileNumber"
          type="text"
          placeholder="Enter mobile number"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Address -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Address</label>
        <textarea
          v-model="user.address"
          rows="3"
          placeholder="Enter address"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-6">
        <button
          type="submit"
          class="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Update
        </button>
        <router-link
          to="/users"
          class="text-gray-600 hover:text-gray-900 underline"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>


<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        dob: "",
        mobileNumber: "",
        address: "",
      },
    };
  },
  async mounted() {
    try {
      //  Get user by ID
      const res = await axios.get(`http://localhost:3000/api/users/${this.id}`);
      const u = res.data.data;

      //  Match frontend camelCase with backend snake_case
      this.user = {
        firstName: u.first_name,
        lastName: u.last_name,
        dob: u.dob,
        mobileNumber: u.mobile_number,
        address: u.address,
      };
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  },
  methods: {
    async updateUser() {
      try {
        //  Send correctly mapped payload to backend
        const payload = {
          First_Name: this.user.firstName,
          Last_Name: this.user.lastName,
          DOB: this.user.dob,
          Mobile_Number: this.user.mobileNumber,
          Address: this.user.address,
        };

        await axios.put(`http://localhost:3000/api/users/update/${this.id}`, payload);

        alert("User updated successfully!");
        this.$router.push("/users");
      } catch (err) {
        console.error("Error updating user:", err);
        alert("Failed to update user");
      }
    },
  },
};
</script>
