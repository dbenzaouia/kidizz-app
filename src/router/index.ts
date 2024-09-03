import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChildcareView from '@/views/ChildcareView.vue';
import ChildView from '@/views/ChildView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/childcare', component: ChildcareView },
  { path: '/childcare/:id/children', component: ChildView, name: 'childList' }, 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
