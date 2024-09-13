<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-4">Home Page</h1>
    
    <input
      v-model="sessionId"
      type="text"
      placeholder="Enter or generate session ID"
      class="border border-gray-300 p-2 mb-4"
    />
    
    <button
      @click="hostSession"
      :disabled="isSessionActive"
      class="bg-blue-500 text-white py-2 px-4 rounded mb-2"
    >
      Host Session
    </button>
    
    <button
      @click="joinSession"
      :disabled="isSessionActive"
      class="bg-green-500 text-white py-2 px-4 rounded"
    >
      Join Session
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

// Emit function declaration
const emit = defineEmits(['onSessionStart']);

// Reactive variables
const sessionId = ref('');
const isSessionActive = ref(false);

// Host session by generating a random session ID
const hostSession = () => {
  sessionId.value = Math.random().toString(36).substring(7);
  isSessionActive.value = true;
  emit('onSessionStart', sessionId.value);
};

// Join session with user-entered session ID
const joinSession = () => {
  if (sessionId.value) {
    isSessionActive.value = true;
    emit('onSessionStart', sessionId.value);
  } else {
    alert('Please enter a session ID.');
  }
};
</script>