<template>
    <div>
      <ul>
        <!-- Loop through player names and display them -->
        <li v-for="player in props.players" :key="player">{{ player }}</li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import {defineProps} from 'vue';
  const props = defineProps({
    players: {
      type: Array,
      required: true
    }
  });
  </script>
  
  <style scoped>
  /* Add styles for player list */
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }
  </style>