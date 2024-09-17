<template>
  <div class="bg-gray-100 min-h-screen">
    <AppNavbar />
    <!--<h3 class="bg-gray-800 text-white py-4 px-6">Draw Whatever You Want the World to See!</h3>-->
    <!-- Render HomePage if not in a session, otherwise show GameHome -->
    <HomePage v-if="!isSessionActive" @onSessionStart="handleSessionChange" />
    <GameHome v-else :sessionId="sessionId" :displayName="displayName" @onSessionEnd="handleSessionEnd"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GameHome from './components/GameHome.vue';
import AppNavbar from './components/AppNavbar.vue';
import HomePage from './components/HomePage.vue';

// Reactive variables
const isSessionActive = ref(false);
const sessionId = ref('');
const displayName = ref('');

// React to session changes when user hosts or joins a session
const handleSessionChange = (id, playerName) => {
  sessionId.value = id;
  displayName.value = playerName;
  isSessionActive.value = true;
};
// Handle session end (user leaves session)
const handleSessionEnd = () => {
  sessionId.value = "";
  isSessionActive.value = false;
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
