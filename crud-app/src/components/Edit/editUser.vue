<template>
  <div class="p-6 mx-auto bg-white shadow rounded-2xl max-w-xl">
    <h2 class="text-4xl font-extrabold mb-8 text-center 
               bg-gradient-to-r from-black to-blue-500 
               bg-clip-text text-transparent tracking-wide">
      Edit User
    </h2>

    <form @submit.prevent="updateUser" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">First Name</label>
        <input v-model="user.first_name" type="text" placeholder="Enter first name" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"/>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
        <input v-model="user.last_name" type="text" placeholder="Enter last name" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"/>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
        <input v-model="user.dob" type="date" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"/>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
        <input v-model="user.mobile_number" type="text" placeholder="Enter mobile number" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"/>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Address</label>
        <textarea v-model="user.address" rows="3" placeholder="Enter address" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"></textarea>
      </div>

      <div class="flex items-center justify-between mt-6">
        <button type="submit" class="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition">Update</button>
        <router-link to="/users" class="text-gray-600 hover:text-gray-900 underline">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import api from "../../axios";

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
      },
      userId: Number(this.$route.params.id),
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await api.get(`/users/${this.userId}`);
        const us = res.data.data;
        this.user.first_name = us.first_name;
        this.user.last_name = us.last_name;
        this.user.dob = us.dob;
        this.user.mobile_number = us.mobile_number;
        this.user.address = us.address;
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Failed to fetch user");
        this.$router.push("/users");
      }
    },
    async updateUser() {
      try {
        await api.put(`/users/${this.userId}`, this.user);
        alert("User updated successfully!");
        this.$router.push("/users");
      } catch (err) {
        console.error("Error updating user:", err);
        alert("Failed to update user");
      }
    },
  },
});
</script>
