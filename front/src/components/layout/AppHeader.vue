<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <header class="bg-primary-700 text-white shadow-md">
    <div class="container mx-auto px-4 flex items-center justify-between h-16">
      <div class="flex items-center">
        <router-link to="/" class="text-xl font-bold">Gestão de Mudança</router-link>
      </div>
      
      <div class="hidden md:flex items-center space-x-4">
        <router-link to="/dashboard" class="px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Dashboard
        </router-link>
        <router-link to="/items" class="px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Items
        </router-link>
        <router-link to="/categories" class="px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Categorias
        </router-link>
        <button @click="handleLogout" class="px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Sair
        </button>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="p-2 rounded hover:bg-primary-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-primary-700 absolute w-full z-10 shadow-lg">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link @click="closeMenu" to="/dashboard" class="block px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Dashboard
        </router-link>
        <router-link @click="closeMenu" to="/items" class="block px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Items
        </router-link>
        <router-link @click="closeMenu" to="/categories" class="block px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Categorias
        </router-link>
        <button @click="handleLogout" class="block w-full text-left px-3 py-2 rounded hover:bg-primary-600 transition-colors">
          Sair
        </button>
      </div>
    </div>
  </header>
</template>