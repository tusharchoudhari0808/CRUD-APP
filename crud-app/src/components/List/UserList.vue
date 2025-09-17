


<template>
  <div class="max-w-6xl mx-auto p-8">
    <!-- Title + Logout -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-extrabold bg-gradient-to-r from-black to-blue-500 bg-clip-text text-transparent tracking-wide">
        User List
      </h2>

      <!-- Show Logout only if logged in -->
      <button 
        v-if="isLoggedIn" 
        @click="logoutAdmin" 
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
      >
        Logout
      </button>
    </div>

    <!-- Add User -->
    <div class="flex justify-end mb-6">
      <router-link 
        v-if="isLoggedIn"
        to="/create" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
      >
        Add User
      </router-link>
    </div>

    <!-- Search + Sort -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search by first name..."
        class="flex-1 min-w-[250px] px-4 py-3 border rounded-lg"
        v-model="searchName"
        @input="handleSearch"
      />
      <select v-model="sortKey" @change="resetAndFetch" class="px-4 py-3 border rounded-lg">
        <option value="">Sort By</option>
        <option value="first_name">First Name</option>
        <option value="dob">DOB</option>
      </select>
      <select v-model="sortOrder" @change="resetAndFetch" class="px-4 py-3 border rounded-lg">
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <div class="w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-green-500 border-b-yellow-500 border-l-red-500 animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-if="tableVisible" class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 bg-white rounded-xl shadow-lg overflow-hidden">
        <thead class="bg-gradient-to-r from-black to-blue-500 text-white">
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
          <tr v-for="user in users" :key="user.user_id" class="hover:bg-gray-50 transition">
            <td class="p-4 border">{{ user.user_id }}</td>
            <td class="p-4 border">{{ user.first_name }}</td>
            <td class="p-4 border">{{ user.last_name }}</td>
            <td class="p-4 border">{{ formatDate(user.dob) }}</td>
            <td class="p-4 border">{{ user.mobile_number }}</td>
            <td class="p-4 border">{{ user.address }}</td>
            <td class="p-4 border">
              <div class="flex justify-center gap-3">
                <!-- Edit/Delete only if logged in -->
                <button 
                  v-if="isLoggedIn"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg" 
                  @click="editUser(user)"
                >
                  Edit
                </button>
                <button 
                  v-if="isLoggedIn"
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" 
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
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50">Prev</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50">Next</button>
      </div>
    </div>

    <!-- No Users -->
    <div v-if="!loading && users.length === 0" class="text-center text-gray-500 mt-8 text-lg">
      No users found.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import api from "../../axios";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

export default defineComponent({
  name: "UserList",
  data() {
    return {
      users: [] as User[],
      page: 1,
      limit: 7,
      totalPages: 1,
      loading: false,
      searchName: "",
      sortKey: "",
      sortOrder: "ASC" as "ASC" | "DESC",
    };
  },
  computed: {
    tableVisible(): boolean {
      return !this.loading && this.users.length > 0;
    },
    isLoggedIn(): boolean {
      return !!localStorage.getItem("token");
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const res = await api.get("/users", {
          params: {
            page: this.page,
            limit: this.limit,
            first_name: this.searchName || undefined,
            sortKey: this.sortKey || undefined,
            order: this.sortOrder || undefined,
          },
        });

      //  console.log("Fetched users:", res.data);

        const paginatedData = res.data.data;
        this.users = paginatedData?.data || [];
        this.totalPages = paginatedData?.totalPages || 1;

      } catch (err) {
        console.error("Error fetching users:", err);
        this.users = [];
        this.totalPages = 1;
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.page = 1;
      this.fetchUsers();
    },
    resetAndFetch() {
      this.page = 1;
      this.fetchUsers();
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
    deleteUser(id: number) {
      if (confirm("Are you sure you want to delete this user?")) {
        api.delete(`/users/${id}`).then(() => this.fetchUsers());
      }
    },
    editUser(user: User) {
      this.$router.push({ name: "EditUser", params: { id: user.user_id } });
    },
    logoutAdmin() {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      this.$router.push("/login");
    },
    formatDate(dateStr: string): string {
      return dateStr ? new Date(dateStr).toLocaleDateString("en-CA") : "";
    },
  },
});
</script>








