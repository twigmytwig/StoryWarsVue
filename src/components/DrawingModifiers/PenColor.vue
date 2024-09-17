<template>
    <div class="flex space-x-2">
      <div 
        v-for="color in colors" 
        :key="color" 
        :style="{ backgroundColor: color }" 
        class="w-8 h-8 cursor-pointer border-2 border-white rounded-full hover:border-gray-500" 
        @click="selectColor(color)">
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  // Define colors for the palette
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
  
  // Emit chosen color
  const emit = defineEmits(['colorSelected']);
  const selectColor = (color) => {
    emit('colorSelected', color);
  };
  </script>
  
  <style scoped>
  /* Style tweaks for hover effects */
  </style>
  