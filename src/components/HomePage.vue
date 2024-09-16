<template>
  <div class="flex flex-col items-center justify-center py-4">
    <h1 class="text-3xl font-bold mb-4">Host a game or join one!</h1>
    <input 
        v-model="displayName" 
        type="text" 
        placeholder="Enter your display name" 
        class="border p-2 mb-4"
      />
    <input
      v-model="sessionId"
      type="text"
      placeholder="Enter invite code to join"
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
import { ref, defineEmits, onMounted } from 'vue';

// Emit function declaration
const emit = defineEmits(['onSessionStart']);

// Reactive variables
const sessionId = ref('');
const displayName = ref(""); // Added displayName
const isSessionActive = ref(false);

// Host session by generating a random session ID
const hostSession = () => {
  if(displayName.value === "" ){
    alert("You have to type in a display name, loser!");
    return;
  }
  if(displayName.value.length > 12){
    alert("Name is too long, doofus!");
    return;
  }
  localStorage.setItem('displayName', displayName.value)
  sessionId.value = Math.random().toString(36).substring(7);
  isSessionActive.value = true;
  emit('onSessionStart', sessionId.value);
};

// Join session with user-entered session ID
const joinSession = () => {
  if(displayName.value === ""){
    alert("You have to type in a display name!");
    return;
  }
  if(displayName.value.length > 12){
    alert("Name is too long, doofus!");
    return;
  }
  localStorage.setItem('displayName', displayName.value)
  if (sessionId.value) {
    isSessionActive.value = true;
    emit('onSessionStart', sessionId.value);
  } else {
    alert('Please enter a session ID.');
  }
};

onMounted(() => {
  const tempDisplayName = localStorage.getItem('displayName');
  if(tempDisplayName !== ""){
    displayName.value = tempDisplayName;
  }
});
</script>