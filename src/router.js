import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AboutUs from './components/NonGameRelated/AboutUs.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutUs },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;