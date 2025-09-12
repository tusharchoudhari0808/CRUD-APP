<template>
  <nav class="bg-gray-800 text-white p-4 flex gap-4">
    <router-link to="/users">User List</router-link>
    <router-link to="/create">Add User</router-link>
  </nav>

  <!-- Render routed components -->
  <router-view></router-view>

  <div class="flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
    <div>
      <!-- Optional additional content -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  // components: {
    
  // },
});
</script>
