<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-blue-50 p-6"
  >
    <div
      class="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 sm:p-12 transform transition duration-500 hover:scale-[1.005] hover:shadow-3xl"
    >
      <h2
        class="text-4xl sm:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent tracking-wide drop-shadow-lg animate-pulse-slow"
      >
        Create New User
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >First Name</label
          >
          <input
            v-model="firstName"
            @input="validateField('firstName')"
            type="text"
            placeholder="Enter first name"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
          <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">
            {{ errors.firstName }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Last Name</label
          >
          <input
            v-model="lastName"
            @input="validateField('lastName')"
            type="text"
            placeholder="Enter last name"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
          <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">
            {{ errors.lastName }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Date of Birth</label
          >
          <input
            v-model="dob"
            @change="validateField('dob')"
            type="date"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
          <p v-if="errors.dob" class="text-red-500 text-sm mt-1">
            {{ errors.dob }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Mobile Number</label
          >
          <input
            v-model="mobile"
            @input="validateField('mobile')"
            type="tel"
            maxlength="10"
            placeholder="10-digit mobile number"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
          <p v-if="errors.mobile" class="text-red-500 text-sm mt-1">
            {{ errors.mobile }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Address</label
          >
          <textarea
            v-model="address"
            @input="validateField('address')"
            placeholder="Enter your address"
            rows="3"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          ></textarea>
          <p v-if="errors.address" class="text-red-500 text-sm mt-1">
            {{ errors.address }}
          </p>
        </div>

        <div class="mt-8 text-center">
          <button
            type="submit"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
/* Custom animations for a more professional feel */
@keyframes pulse-slow {
  0%,
  100% {
    filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}

.hover\:shadow-3xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import api from "../../axios";
import Swal from "sweetalert2";

interface Errors {
  firstName?: string;
  lastName?: string;
  dob?: string;
  mobile?: string;
  address?: string;
}

interface UserPayload {
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

export default defineComponent({
  name: "CreateUsers",
  data() {
    return {
      firstName: "",
      lastName: "",
      dob: "",
      mobile: "",
      address: "",
      errors: {} as Errors,
    };
  },
  methods: {
    validateField(field: keyof Errors): void {
      switch (field) {
        case "firstName":
          if (!this.firstName.trim()) this.errors.firstName = "First name is required.";
          else if (!/^[A-Za-z\s]+$/.test(this.firstName.trim())) this.errors.firstName = "First name must contain only letters.";
          else delete this.errors.firstName;
          break;
        case "lastName":
          if (!this.lastName.trim()) this.errors.lastName = "Last name is required.";
          else if (!/^[A-Za-z\s]+$/.test(this.lastName.trim())) this.errors.lastName = "Last name must contain only letters.";
          else delete this.errors.lastName;
          break;
        case "dob":
          if (!this.dob) this.errors.dob = "DOB is required.";
          else delete this.errors.dob;
          break;
        case "mobile":
          if (!/^[0-9]{10}$/.test(this.mobile.trim())) this.errors.mobile = "Valid 10-digit mobile required.";
          else delete this.errors.mobile;
          break;
        case "address":
          if (!this.address.trim()) this.errors.address = "Address is required.";
          else delete this.errors.address;
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

    async handleSubmit(): Promise<void> {
      if (!this.validateForm()) return;

      try {
        const payload: UserPayload = {
          first_name: this.firstName.trim(),
          last_name: this.lastName.trim(),
          dob: this.dob,
          mobile_number: this.mobile.trim(),
          address: this.address.trim(),
        };

        // Send request with cookies automatically
        await api.post("/users", payload, { withCredentials: true });

        Swal.fire({
          title: "User added successfully!",
          text: "The new user has been created.",
          icon: "success",
        });

        this.$router.push("/users");
      } catch (err) {
        console.error("Error creating user:", err);
        Swal.fire({
          icon: "error",
          title: "Error creating user",
          text: "Something went wrong while adding the user.",
        });
      }
    },
  },
});
</script>
