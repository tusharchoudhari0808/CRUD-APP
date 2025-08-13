<template>
  <div class="max-w-20x10 mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">User Form</h1>

    <form
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl"
    >
      <div>
        <input
          v-model="firstName"
          placeholder="First Name"
          class="w-full px-4 py-2 border rounded-md"
        />
        <p class="text-red-500 text-sm mt-1" v-if="errors.firstName">
          {{ errors.firstName }}
        </p>
      </div>
      <div>
        <input
          v-model="lastName"
          placeholder="Last Name"
          class="w-full px-4 py-2 border rounded-md"
        />
        <p class="text-red-500 text-sm mt-1" v-if="errors.lastName">
          {{ errors.lastName }}
        </p>
      </div>
      <div>
        <input
          v-model="dob"
          type="date"
          class="w-full px-4 py-2 border rounded-md"
        />
        <p class="text-red-500 text-sm mt-1" v-if="errors.dob">
          {{ errors.dob }}
        </p>
      </div>
      <div>
        <input
          v-model="mobile"
          placeholder="Mobile (10 digits)"
          class="w-full px-4 py-2 border rounded-md"
        />
        <p class="text-red-500 text-sm mt-1" v-if="errors.mobile">
          {{ errors.mobile }}
        </p>
      </div>
      <div class="col-span-1 md:col-span-2">
        <textarea
          v-model="address"
          placeholder="Address"
          class="w-full px-4 py-2 border rounded-md"
        ></textarea>
        <p class="text-red-500 text-sm mt-1" v-if="errors.address">
          {{ errors.address }}
        </p>
      </div>
      <div class="col-span-2 text-right">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          {{ id ? "Update User" : "Add User" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateUsers",
  props: ["id"],
  data() {
    return {
      firstName: "",
      lastName: "",
      dob: "",
      mobile: "",
      address: "",
      errors: {},
    };
  },
  mounted() {
    if (this.id) {
      this.loadUser(); // If editing, load user data
    }
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.firstName.trim())
        this.errors.firstName = "First name is required.";
      if (!this.lastName.trim())
        this.errors.lastName = "Last name is required.";
      if (!this.dob) this.errors.dob = "DOB is required.";
      if (!/^\d{10}$/.test(this.mobile))
        this.errors.mobile = "Valid 10-digit mobile required.";
      if (!this.address.trim()) this.errors.address = "Address is required.";
      return Object.keys(this.errors).length === 0;
    },

    async loadUser() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/get/${this.id}`
        );
        const user = res.data;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.dob = user.dob.split("T")[0]; // format for input[type="date"]
        this.mobile = user.mobile_number;
        this.address = user.address;
      } catch (err) {
        console.error("Error loading user:", err);
      }
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

          if (this.id) {
            // ✅ Update existing user
            await axios.put(
              `http://localhost:3000/api/users/update/${this.id}`,
              payload
            );

            alert("User updated successfully!");

          } else {
            // ✅ Create new user
            await axios.post("http://localhost:3000/api/users/create", payload);
            alert("User added successfully!");
          }
          this.$router.push("/users");
          this.resetForm();
        } catch (err) {
          alert("Error processing request");
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
      this.errors = {};
    },
  },
};
</script>
