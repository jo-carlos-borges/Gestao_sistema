<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import { useAuthStore } from './store/auth';

const route = useRoute();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAuthRoute = computed(() => {
  return route.path === '/login' || route.path === '/register';
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="isAuthenticated" />
    
    <div class="flex-grow flex" v-if="isAuthenticated">
      <AppSidebar />
      <main class="flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto">
        <router-view />
      </main>
    </div>
    
    <div class="flex-grow flex items-center justify-center bg-gray-50" v-else>
      <router-view />
    </div>
  </div>
</template>