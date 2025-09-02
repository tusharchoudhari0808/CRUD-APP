<template>
  <div class="max-w-30x5 mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">User Form</h1>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="grid grid-cols-1  gap-4 bg-white p-6 rounded-xl ">
      <div>
        <input v-model="firstName" placeholder="First Name" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-red-500 text-sm mt-1" v-if="errors.firstName">{{ errors.firstName }}</p>
      </div>
      <div>
        <input v-model="lastName" placeholder="Last Name" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-red-500 text-sm mt-1" v-if="errors.lastName">{{ errors.lastName }}</p>
      </div>
      <div>
        <input v-model="dob" type="date" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-red-500 text-sm mt-1" v-if="errors.dob">{{ errors.dob }}</p>
      </div>
      <div>
        <input v-model="mobile" placeholder="Mobile (10 digits)" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-red-500 text-sm mt-1" v-if="errors.mobile">{{ errors.mobile }}</p>
      </div>
      <div class="col-span-1 md:col-span-2">
        <textarea v-model="address" placeholder="Address" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <p class="text-red-500 text-sm mt-1" v-if="errors.address">{{ errors.address }}</p>
      </div>
      <div class="col-span-2 text-right">
        <button
          type="submit"
          :disabled="editingUserId !== null"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>

    <!-- Table -->
    <div class="mt-10">
      <h2 class="text-2xl font-bold mb-4 text-gray-700">User List</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
          <thead class="bg-green-100">
            <tr>
              <th class="p-3 border text-left">ID</th>
              <th class="p-3 border text-left">First Name</th>
              <th class="p-3 border text-left">Last Name</th>
              <th class="p-3 border text-left">DOB</th>
              <th class="p-3 border text-left">Mobile</th>
              <th class="p-3 border text-left">Address</th>
              <th class="p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.user_id" class="hover:bg-gray-100">
              <td class="p-3 border">{{ user.user_id }}</td>
              <td class="p-3 border">{{ user.first_name }}</td>
              <td class="p-3 border">{{ user.last_name }}</td>
              <td class="p-3 border">{{ formatDate(user.dob) }}</td>
              <td class="p-3 border">{{ user.mobile_number }}</td>
              <td class="p-3 border">{{ user.address }}</td>
              <td class="p-3 border space-x-2">
                <button
                  class="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                  @click="editUser(user)"
                >
                  Edit
                </button>
                <button
                  class="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                  v-if="editingUserId === user.user_id"
                  @click="updateUser(user.user_id)"
                >
                  Update
                </button>
               
              </td>
            </tr>
          </tbody>
        </table>
       

      </div>
    </div>
     <div class="flex justify-end mb-4">
  <button
    class="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded shadow"
    @click="deleteUser"
    v-if="users.length > 0"
    
  >
    Delete All Users
  </button>
</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Form",
  data() {
    return {
      firstName: "",
      lastName: "",
      dob: "",
      mobile: "",
      address: "",
      errors: {},
      users: [],
      editingUserId: null,
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const res = await axios.get("http://localhost:3000/api/users/getAll");
        this.users = res.data;
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB");
    },
    validateForm() {
      this.errors = {};
      if (!this.firstName.trim()) this.errors.firstName = "First name is required.";
      if (!this.lastName.trim()) this.errors.lastName = "Last name is required.";
      if (!this.dob) this.errors.dob = "DOB is required.";
      if (!/^\d{10}$/.test(this.mobile)) this.errors.mobile = "Valid 10-digit mobile required.";
      if (!this.address.trim()) this.errors.address = "Address is required.";
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (this.validateForm()) {
        try {
          const payload = {
            First_Name: this.firstName,
            Last_Name: this.lastName,
            DOB: this.dob,
            Mobile_Number: this.mobile,
            Address: this.address,
          };
          await axios.post("http://localhost:3000/api/users/create", payload);
          alert("User added successfully!");
          this.getUsers();
          this.resetForm();
        } catch (err) {
          alert("Error adding user");
          console.error(err);
        }
      }
    },
    editUser(user) {
      this.firstName = user.first_name;
      this.lastName = user.last_name;
    this.dob = user.dob;
      this.mobile = user.mobile_number;
      this.address = user.address;
      this. editingUserId = user.user_id;

const date = new Date(user.dob);
  this.dob = date.toISOString().substr(0, 10);

  this.editingUserId = user.user_id;

    },
    async updateUser(id) {
      if (this.validateForm()) {
        try {
          const payload = {
            First_Name: this.firstName,
            Last_Name: this.lastName,
            DOB: this.dob,
            Mobile_Number: this.mobile,
            Address: this.address,
          };
          await axios.put(`http://localhost:3000/api/users/update/${id}`, payload);
          alert("User updated!");
          this.getUsers();
          this.resetForm();
        } catch (err) {
          alert("Update failed!");
          console.error(err);
        }
      }
    },
    async deleteUser() {
    
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await axios.delete(`http://localhost:3000/api/users/delete/${id}`);
          alert("User deleted successfully!");
          this.getUsers();
          this.resetForm();
        } catch (err) {
          alert("Failed to delete user.");
          console.error(err);
        }
      }
    },
    resetForm() {
      this.firstName = "";
      this.lastName = "";
      this.dob = "";
      this.mobile = "";
      this.address = "";
      this.editingUserId = null;
      this.errors = {};
    },
  },
};
</script>


               