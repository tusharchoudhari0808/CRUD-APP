<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-200 to-blue-50 p-8 sm:p-12">
    <div class="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-6 sm:p-10 transform transition duration-500 hover:scale-[1.005] hover:shadow-3xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 class="text-4xl sm:text-5xl font-extrabold mb-2 text-center bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent tracking-wide drop-shadow-lg animate-pulse-slow">
          User List
        </h2>

        <button
          v-if="isLoggedIn"
          @click="logoutAdmin"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          Logout
        </button>
      </div>

      <!-- Search + Sort -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <router-link
          v-if="isLoggedIn && isRole === 'superAdmin'"
          to="/create"
          class="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        >
          Add New User
        </router-link>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by first name..."
            class="flex-1 min-w-[200px] px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
            v-model="searchName"
            @input="handleSearch"
          />
          <select
            v-model="sortKey"
            @change="resetAndFetch"
            class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          >
            <option value="">Sort By</option>
            <option value="first_name">First Name</option>
            <option value="dob">DOB</option>
          </select>
          <select
            v-model="sortOrder"
            @change="resetAndFetch"
            class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center h-40">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-dashed rounded-full border-blue-500 animate-spin"></div>
          <div class="absolute inset-2 border-4 border-solid rounded-full border-blue-300 animate-spin-reverse"></div>
        </div>
      </div>

      <!-- User Table -->
      <div v-if="tableVisible" class="overflow-x-auto no-scrollbar">
        <table class="min-w-full bg-white rounded-3xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.005]">
          <thead class="bg-gray-900 text-white">
            <tr>
              <th class="p-4 text-left font-semibold">ID</th>
              <th class="p-4 text-left font-semibold">First Name</th>
              <th class="p-4 text-left font-semibold">Last Name</th>
              <th class="p-4 text-left font-semibold">DOB</th>
              <th class="p-4 text-left font-semibold">Mobile</th>
              <th class="p-4 text-left font-semibold">Address</th>
              <th class="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in users"
              :key="user.user_id"
              :class="{
                'bg-gray-50': index % 2 !== 0,
                'hover:bg-gray-100': true,
                'transition-all duration-200': true,
              }"
            >
              <td class="p-4 border-t border-gray-200">{{ user.user_id }}</td>
              <td class="p-4 border-t border-gray-200">{{ user.first_name }}</td>
              <td class="p-4 border-t border-gray-200">{{ user.last_name }}</td>
              <td class="p-4 border-t border-gray-200">{{ formatDate(user.dob) }}</td>
              <td class="p-4 border-t border-gray-200">{{ user.mobile_number }}</td>
              <td class="p-4 border-t border-gray-200">{{ user.address }}</td>
              <td class="p-4 border-t border-gray-200">
                <div class="flex justify-center gap-3">
                  <button
                    v-if="isLoggedIn && ['superAdmin', 'Admin'].includes(isRole)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-110"
                    @click="editUser(user)"
                  >
                    Edit
                  </button>
                  <button
                    v-if="isLoggedIn && isRole === 'superAdmin'"
                    class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-110"
                    @click="deleteUser(user.user_id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center gap-6 mt-8">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-full disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:bg-gray-400"
        >
          Prev
        </button>
        <span class="text-gray-600 font-medium text-lg">
          Page {{ page }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-full disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      <!-- No Users -->
      <div
        v-if="!loading && users.length === 0"
        class="text-center text-gray-500 mt-12 text-2xl font-semibold animate-fadeIn"
      >
        No users found.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
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
  setup() {
    const router = useRouter();

    const users = ref<User[]>([]);
    const page = ref(1);
    const limit = ref(7);
    const totalPages = ref(1);
    const loading = ref(false);
    const searchName = ref("");
    const sortKey = ref("");
    const sortOrder = ref<"ASC" | "DESC">("ASC");
    const isLoggedIn = ref(false);
    const isRole = ref<string>("");

    const tableVisible = computed(() => users.value.length > 0);

    const checkLogin = async () => {
      try {
        const res = await api.get("/admin/verify", { withCredentials: true });
        isLoggedIn.value = !!res.data?.admin;
        isRole.value = res.data.admin.role;
      } catch {
        isLoggedIn.value = false;
        isRole.value = "";
      }
    };

    const fetchUsers = async () => {
      try {
        loading.value = true;
        const res = await api.get("/users", {
          withCredentials: true,
          params: {
            page: page.value,
            limit: limit.value,
            first_name: searchName.value || undefined,
            sortKey: sortKey.value || undefined,
            order: sortOrder.value || undefined,
          },
        });
        const paginatedData = res.data.data;
        users.value = paginatedData?.data || [];
        totalPages.value = paginatedData?.totalPages || 1;
      } catch (err) {
        console.error("Error fetching users:", err);
        users.value = [];
        totalPages.value = 1;
      } finally {
        loading.value = false;
      }
    };

    const logoutAdmin = async () => {
      try {
        await api.post("/admin/logout", {}, { withCredentials: true });
      } catch (err) {
        console.warn("Logout failed (maybe no active session).");
      }
      isLoggedIn.value = false;
      router.push("/login");
    };

    const handleSearch = () => {
      page.value = 1;
      fetchUsers();
    };

    const resetAndFetch = () => {
      page.value = 1;
      fetchUsers();
    };

    const nextPage = () => {
      if (page.value < totalPages.value) {
        page.value++;
        fetchUsers();
      }
    };

    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchUsers();
      }
    };

    const deleteUser = async (id: number) => {
      if (!confirm("Are you sure you want to delete this user?")) return;
      try {
        await api.delete(`/users/${id}`, { withCredentials: true });
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    };

    const editUser = (user: User) => {
      router.push({ name: "EditUser", params: { id: user.user_id } });
    };

    const formatDate = (dateStr: string) =>
      dateStr ? new Date(dateStr).toLocaleDateString("en-CA") : "";

    onMounted(async () => {
      await checkLogin();
      if (!isLoggedIn.value) {
        router.push("/login");
      } else {
        fetchUsers();
      }
    });

    return {
      users,
      page,
      limit,
      totalPages,
      loading,
      searchName,
      sortKey,
      sortOrder,
      isLoggedIn,
      isRole,
      tableVisible,
      fetchUsers,
      handleSearch,
      resetAndFetch,
      nextPage,
      prevPage,
      deleteUser,
      editUser,
      formatDate,
      logoutAdmin,
    };
  },
});
</script>
