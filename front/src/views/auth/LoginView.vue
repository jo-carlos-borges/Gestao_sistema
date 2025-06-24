<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('demo@example.com');
const password = ref('password');
const loading = ref(false);
const errorMessage = ref('');

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value
    });
    
    if (success) {
      router.push('/dashboard');
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md p-6">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-primary-700 mb-2">Gestão de Mudança</h1>
      <p class="text-gray-600">Log in to manage your pantry items</p>
    </div>
    
    <div class="card">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
      
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div class="mb-6">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div v-if="errorMessage" class="mb-4 text-error-700 text-sm bg-error-50 p-2 rounded">
          {{ errorMessage }}
        </div>
        
        <div class="flex flex-col gap-4">
          <button
            type="submit"
            class="btn btn-primary w-full flex justify-center"
            :disabled="loading"
          >
            <template v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </template>
            <template v-else>
              Log In
            </template>
          </button>
          
          <div class="text-center text-gray-600 text-sm">
            Don't have an account?
            <router-link to="/register" class="text-primary-600 hover:text-primary-800">Register</router-link>
          </div>
        </div>
      </form>
    </div>

    <div class="mt-4 text-center text-sm text-gray-600">
      <p>Demo credentials are pre-filled for you.</p>
    </div>
  </div>
</template>