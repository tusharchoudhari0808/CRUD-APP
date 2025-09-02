<template>
  <div class="p-6 mx-auto bg-white shadow rounded-2xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-700 text-center">Edit User</h2>

    <form @submit.prevent="updateUser" class="space-y-4">
      <!-- First Name -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">First Name</label>
        <input
          v-model="user.firstName"
          type="text"
          placeholder="Enter first name"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
        <input
          v-model="user.lastName"
          type="text"
          placeholder="Enter last name"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
      </div>

      <!-- DOB -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
        <input
          v-model="user.dob"
          type="date"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
      </div>

      <!-- Mobile -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
        <input
          v-model="user.mobileNumber"
          type="text"
          placeholder="Enter mobile number"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
      </div>

      <!-- Address -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Address</label>
        <textarea
          v-model="user.address"
          rows="3"
          placeholder="Enter address"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-6">
        <button
          type="submit"
          class="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
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

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
  dob: string;
  mobileNumber: string;
  address: string;
}

export default defineComponent({
  name: "EditUser",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const user = reactive<User>({
      firstName: "",
      lastName: "",
      dob: "",
      mobileNumber: "",
      address: "",
    });

    // Fetch user by ID
    onMounted(async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/${props.id}`);
        const u = res.data.data;

        user.firstName = u.first_name;
        user.lastName = u.last_name;
        user.dob = u.dob;
        user.mobileNumber = u.mobile_number;
        user.address = u.address;
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    });

    // Update user
    const updateUser = async () => {
      try {
        const payload = {
          First_Name: user.firstName,
          Last_Name: user.lastName,
          DOB: user.dob,
          Mobile_Number: user.mobileNumber,
          Address: user.address,
        };

        await axios.put(`http://localhost:3000/api/users/update/${props.id}`, payload);

        alert("User updated successfully!");
        router.push("/users");
      } catch (err) {
        console.error("Error updating user:", err);
        alert("Failed to update user");
      }
    };

    return {
      user,
      updateUser,
    };
  },
});
</script>
