<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-700">User List</h2>
    <!-- //Router path.... -->

    <router-link
      to="/create"
      class="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >Add User</router-link
    >

    <div class="overflow-x-auto">
      <table
        class="min-w-full border border-gray-300 bg-white rounded-lg shadow-md"
      >
        <thead class="bg-green-100">
          <tr>
            <th class="p-3 border">ID</th>
            <th class="p-3 border">First Name</th>
            <th class="p-3 border">Last Name</th>
            <th class="p-3 border">DOB</th>
            <th class="p-3 border">Mobile</th>
            <th class="p-3 border">Address</th>
            <th class="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id">
            <td class="p-3 border">{{ user.user_id }}</td>
            <td class="p-3 border">{{ user.first_name }}</td>
            <td class="p-3 border">{{ user.last_name }}</td>
            <td class="p-3 border">{{ formatDate(user.dob) }}</td>
            <td class="p-3 border">{{ user.mobile_number }}</td>
            <td class="p-3 border">{{ user.address }}</td>
            <td class="p-3 border">
              <button
                class="bg-yellow-500 text-white px-3 py-1 rounded"
                @click="editUser(user)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 text-white px-3 py-1 rounded"
                @click="deleteUser(user.user_id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-end mt-4">
      
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserList",
  data() {
    return {
      firstName: "",
      lastName: "",
      dob: "",
      mobile: "",
      address: "",
      //editingUserId: null,
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/getAll`);
        this.users = res.data;
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB");
    },
    editUser(user) {
      this.$router.push(`/create/${user.user_id}`);
    },

    async deleteUser(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        await axios.delete(`http://localhost:3000/api/users/delete/${id}`);
        this.getUsers();
      }
    },
  },
};
</script>
