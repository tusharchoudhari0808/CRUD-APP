<template>
  <div class="max-w-6xl mx-auto p-8">
    <!-- Page Heading -->
    <h2 class="text-4xl font-extrabold mb-8 text-center text-blue-700 tracking-wide">
      User List
    </h2>

    <!-- Add User Button -->
    <div class="flex justify-end mb-6">
      <router-link
        to="/create"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
      >
        Add User
      </router-link>
    </div>

    <!-- Search + Sort Controls -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search by name..."
        class="flex-1 min-w-[250px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        v-model="searchName"
        @input="handleSearch"
      />

      <select
        v-model="sortKey"
        @change="resetAndFetch"
        class="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      >
        <option value="">Sort By</option>
        <option value="first_name">First Name</option>
        <option value="dob">DOB</option>
      </select>

      <select
        v-model="sortOrder"
        @change="resetAndFetch"
        class="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      >
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <div
        class="w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-green-500 border-b-yellow-500 border-l-red-500 animate-spin"
      ></div>
    </div>

    <!-- Table -->
    <div v-if="tableVisible" class="overflow-x-auto">
      <table
        class="min-w-full border border-gray-200 bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <thead class="bg-blue-50 text-blue-700">
          <tr>
            <th class="p-4 text-left border">ID</th>
            <th class="p-4 text-left border">First Name</th>
            <th class="p-4 text-left border">Last Name</th>
            <th class="p-4 text-left border">DOB</th>
            <th class="p-4 text-left border">Mobile</th>
            <th class="p-4 text-left border">Address</th>
            <th class="p-4 text-center border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.user_id"
            class="hover:bg-gray-50 transition"
          >
            <td class="p-4 border">{{ user.user_id }}</td>
            <td class="p-4 border">{{ user.first_name }}</td>
            <td class="p-4 border">{{ user.last_name }}</td>
            <td class="p-4 border">{{ formatDate(user.dob) }}</td>
            <td class="p-4 border">{{ user.mobile_number }}</td>
            <td class="p-4 border">{{ user.address }}</td>
            <td class="p-4 border">
              <div class="flex justify-center gap-3">
                <button
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition"
                  @click="editUser(user)"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
                  @click="deleteUser(user.user_id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-center gap-6 mt-6">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span class="text-gray-700 font-medium">
          Page {{ page }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- No Data Message -->
    <div
      v-if="!loading && users.length === 0"
      class="text-center text-gray-500 mt-8 text-lg"
    >
      No users found.
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "UserList",
  data() {
    return {
      users: [],
      searchName: "",
      page: 1,
      limit: 10,
      sortKey: "",
      sortOrder: "ASC",
      totalPages: 1,
      loading: false,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    tableVisible() {
      return !this.loading && this.users.length > 0;
    },
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const res = await axios.get("http://localhost:3000/api/users/page/list", {
          params: {
            page: this.page,
            limit: this.limit,
            first_name: this.searchName || "",
            sortKey: this.sortKey || "",
            order: this.sortOrder,
          },
        });

        console.log("API Response:", res.data);

        this.users = res.data.data.data || [];
        this.totalPages = res.data.data.totalPages || 1;
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        this.loading = false;
      }
    },

    resetAndFetch() {
      this.page = 1;
      this.fetchUsers();
    },

    handleSearch() {
      this.page = 1;
      this.fetchUsers();
    },

    async deleteUser(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          this.loading = true;
          await axios.delete(`http://localhost:3000/api/users/delete/${id}`);
          this.fetchUsers();
        } catch (err) {
          console.error("Error deleting user:", err);
        } finally {
          this.loading = false;
        }
      }
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchUsers();
      }
    },

    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchUsers();
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toISOString().split("T")[0];
    },

    editUser(user) {
      this.$router.push({ name: "EditUser", params: { id: user.user_id } });
    },
  },
};
</script>
