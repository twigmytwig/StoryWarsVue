<template>
  <AppNavbar />
  <h3 class="bg-gray-800 text-white py-4 px-6">Draw Whatever You Want the World to See!</h3>
  <DrawingBoard />
</template>

<script>
import DrawingBoard from './components/DrawingBoard.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
  name: 'App',
  components: {
    DrawingBoard,
    AppNavbar
  }
}
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
