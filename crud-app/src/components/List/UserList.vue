<template>
  <div class="max-w-6xl mx-auto p-8">
    <h2 class="text-4xl font-extrabold mb-8 text-center text-blue-700 tracking-wide">
      User List
    </h2>

    <!-- Add User -->
    <div class="flex justify-end mb-6">
      <router-link
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
        placeholder="Search by name..."
        class="flex-1 min-w-[250px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
          <tr v-for="user in users" :key="user.user_id" class="hover:bg-gray-50 transition">
            <td class="p-4 border">{{ user.user_id }}</td>
            <td class="p-4 border">{{ user.first_name }}</td>
            <td class="p-4 border">{{ user.last_name }}</td>
            <td class="p-4 border">{{ formatDate(user.dob) }}</td>
            <td class="p-4 border">{{ user.mobile_number }}</td>
            <td class="p-4 border">{{ user.address }}</td>
            <td class="p-4 border">
              <div class="flex justify-center gap-3">
                <button
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  @click="editUser(user)"
                >
                  Edit
                </button>
                <button
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
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-gray-300 rounded-lg">
          Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-4 py-2 bg-gray-300 rounded-lg">
          Next
        </button>
      </div>
    </div>

    <div v-if="!loading && users.length === 0" class="text-center text-gray-500 mt-8 text-lg">
      No users found.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios, { AxiosResponse } from "axios";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

interface ApiResponse {
  data: {
    data: User[];
    totalPages: number;
  };
}

export default defineComponent({
  name: "UserList",
  data() {
    return {
      users: [] as User[],
      searchName: "" as string,
      page: 1 as number,
      limit: 10 as number,
      sortKey: "" as string,
      sortOrder: "ASC" as "ASC" | "DESC",
      totalPages: 1 as number,
      loading: false as boolean,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    tableVisible(): boolean {
      return !this.loading && this.users.length > 0;
    },
  },
  methods: {
    async fetchUsers(): Promise<void> {
      try {
        this.loading = true;
        const res: AxiosResponse<ApiResponse> = await axios.get(
          "http://localhost:3000/api/users/",
          {
            params: {
              page: this.page,
              limit: this.limit,
              first_name: this.searchName || "",
              sortKey: this.sortKey || "",
              order: this.sortOrder,
            },
          }
        );

        this.users = res.data.data.data ;
        this.totalPages = res.data.data.totalPages;
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        this.loading = false;
      }
    },
    resetAndFetch(): void {
      this.page = 1;
      this.fetchUsers();
    },
    handleSearch(): void {
      this.page = 1;
      this.fetchUsers();
    },
    async deleteUser(id: number): Promise<void> {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await axios.delete(`http://localhost:3000/api/users/${id}`);
          this.fetchUsers();
        } catch (err) {
          console.error("Error deleting user:", err);
        }
      }
    },
    nextPage(): void {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchUsers();
      }
    },
    prevPage(): void {
      if (this.page > 1) {
        this.page--;
        this.fetchUsers();
      }
    },
    formatDate(dateStr: string): string {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toISOString().split("T")[0];
    },
    editUser(user: User): void {
      this.$router.push({ name: "EditUser", params: { id: user.user_id } });
    },
  },
});
</script>
