<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-4xl font-extrabold mb-8 text-center text-blue-700 tracking-wide">
      User Form
    </h1>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- First Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">First Name</label>
        <input
          v-model="firstName"
          @input="validateField('firstName')"
          type="text"
          placeholder="Enter first name"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">
          {{ errors.firstName }}
        </p>
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Last Name</label>
        <input
          v-model="lastName"
          @input="validateField('lastName')"
          type="text"
          placeholder="Enter last name"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">
          {{ errors.lastName }}
        </p>
      </div>

      <!-- DOB -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Date of Birth</label>
        <input
          v-model="dob"
          @change="validateField('dob')"
          type="date"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.dob" class="text-red-500 text-sm mt-1">{{ errors.dob }}</p>
      </div>

      <!-- Mobile -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Mobile Number</label>
        <input
          v-model="mobile"
          @input="validateField('mobile')"
          type="tel"
          maxlength="10"
          placeholder="10-digit mobile number"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p v-if="errors.mobile" class="text-red-500 text-sm mt-1">
          {{ errors.mobile }}
        </p>
      </div>

      <!-- Address -->
      <div class="md:col-span-2">
        <label class="block text-gray-700 font-medium mb-2">Address</label>
        <textarea
          v-model="address"
          @input="validateField('address')"
          placeholder="Enter your address"
          rows="3"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        ></textarea>
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">
          {{ errors.address }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="md:col-span-2 text-right">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          {{ id ? "Update User" : "Add User" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

interface Errors {
  firstName?: string;
  lastName?: string;
  dob?: string;
  mobile?: string;
  address?: string;
}

interface User {
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

export default defineComponent({
  name: "CreateUsers",
  props: {
    id: { type: Number, required: false },
  },
  data() {
    return {
      firstName: "" as string,
      lastName: "" as string,
      dob: "" as string,
      mobile: "" as string,
      address: "" as string,
      errors: {} as Errors,
    };
  },
  mounted() {
    if (this.id) this.loadUser();
  },
  methods: {
   validateField(field: keyof Errors): void {
  switch (field) {
    case "firstName":
      if (!this.firstName.trim()) {
        this.errors.firstName = "First name is required.";
      } else if (!/^[A-Za-z\s]+$/.test(this.firstName.trim())) {
        this.errors.firstName = "First name must contain only letters.";
      } else {
        delete this.errors.firstName;
      }
      break;

    case "lastName":
      if (!this.lastName.trim()) {
        this.errors.lastName = "Last name is required.";
      } else if (!/^[A-Za-z\s]+$/.test(this.lastName.trim())) {
        this.errors.lastName = "Last name must contain only letters.";
      } else {
        delete this.errors.lastName;
      }
      break;

    case "dob":
      if (!this.dob) this.errors.dob = "DOB is required.";
      else delete this.errors.dob;
      break;

    case "mobile":
      if (!/^[0-9]{10}$/.test(this.mobile.trim())) {
        this.errors.mobile = "Valid 10-digit mobile required.";
      } else {
        delete this.errors.mobile;
      }
      break;

    case "address":
      if (!this.address.trim()) {
        this.errors.address = "Address is required.";
      } else {
        delete this.errors.address;
      }
      break;
  }
},

    validateForm(): boolean {
      this.validateField("firstName");
      this.validateField("lastName");
      this.validateField("dob");
      this.validateField("mobile");
      this.validateField("address");
      return Object.keys(this.errors).length === 0;
    },
    async loadUser(): Promise<void> {
      try {
        const res = await axios.get<User>(`http://localhost:3000/api/users/${this.id}`);
        const user = res.data;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.dob = user.dob.split("T")[0];
        this.mobile = user.mobile_number;
        this.address = user.address;
      } catch (err) {
        console.error("Error loading user:", err);
      }
    },
    async handleSubmit(): Promise<void> {
      if (this.validateForm()) {
        try {
          const payload = {
            first_name: this.firstName.trim(),
            last_name: this.lastName.trim(),
            dob: this.dob,
            mobile_number: this.mobile.trim(),
            address: this.address.trim(),
          };

          if (this.id) {
            await axios.put(`http://localhost:3000/api/users/${this.id}`, payload);
            alert("User updated successfully!");
          } else {
            await axios.post("http://localhost:3000/api/users", payload);
            alert("User added successfully!");
          }

          this.$router.push("/users");
        } catch (err) {
          alert("Error processing request");
          console.error(err);
        }
      }
    },
  },
});
</script>
