<template>
  <h1 class="text-black text-center mt-20 font-extrabold text-5xl tracking-wide drop-shadow-lg">
    CRUD Application
  </h1>

  <div class="flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-xl shadow-xl shadow-gray-700 bg-white p-6 rounded-xl">
      <Form />
    </div>
  </div>
</template>

<script>
import Form from './components/Form/Form.vue'

export default {
  name: 'App',
  components: {
    Form
  },
}
</script>
