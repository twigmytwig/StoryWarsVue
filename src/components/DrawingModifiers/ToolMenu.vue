<template>
    <div class="flex space-x-4">
      <button
        :class="{'bg-blue-500': currentTool === 'draw', 'bg-gray-300': currentTool !== 'draw'}"
        @click="selectTool('draw')"
        class="p-2 rounded"
      >
        Draw
      </button>
      <button
        :class="{'bg-red-500': currentTool === 'erase', 'bg-gray-300': currentTool !== 'erase'}"
        @click="selectTool('erase')"
        class="p-2 rounded"
      >
        Erase
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const emit = defineEmits(['toolChange']);
  
  const currentTool = ref('draw'); // Default tool is 'draw'
  
  const selectTool = (tool) => {
    currentTool.value = tool;
    emit('toolChange', tool); // Emit the selected tool to parent
  };
  </script>
  
  <style scoped>
  button {
    border: none;
    color: white;
    cursor: pointer;
  }
  
  button.bg-blue-500 {
    background-color: #3b82f6;
  }
  
  button.bg-red-500 {
    background-color: #ef4444;
  }
  
  button.bg-gray-300 {
    background-color: #d1d5db;
  }
  </style>