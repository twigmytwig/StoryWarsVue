<template>
    <nav class="bg-gray-900 text-white py-4 px-6">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Logo/Title -->
        <div class="text-2xl font-bold">
          <router-link to="/" class="hover:text-gray-400">Story Wars</router-link>
        </div>
        
        <!-- Navigation Links -->
        <div class="space-x-4">
          <router-link to="/" class="hover:text-gray-400">Home</router-link>
          <router-link to="/about" class="hover:text-gray-400">About</router-link>
          <router-link to="/games" class="hover:text-gray-400">Games</router-link>
          <router-link to="/contact" class="hover:text-gray-400">Contact</router-link>
        </div>
        
        <!-- User Actions (e.g., Login/Sign Up) -->
        <div class="space-x-4">
          <router-link to="/login" class="hover:text-gray-400">Login</router-link>
          <router-link to="/signup" class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Sign Up</router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'AppNavbar'
  }
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>