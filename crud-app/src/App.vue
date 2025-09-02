<template>
<!-- 
  <h1 class="text-black text-center mt-20 font-extrabold text-5xl tracking-wide drop-shadow-lg">
    CRUD Application
  </h1> -->

 <nav class="bg-gray-800 text-white p-4 flex gap-4">
    <router-link to="/users">User List</router-link>
    <router-link to="/create">Add User</router-link>
  </nav>
  <router-view></router-view>
  

  <div class="flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
    <div >
      
      <Form />
    </div>
  </div>
</template>

<script>
//import Form from './components/Form/Form.vue'
//import ListUserData from './components/List/ListUserData.vue'

export default {
  name: 'App',
  components: {
   // Form
   // ListUserData,
  },
}
</script>
