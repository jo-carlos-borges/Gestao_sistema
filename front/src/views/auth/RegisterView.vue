<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');

const register = async () => {
  // Basic validation
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill out all fields';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const success = await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    });
    
    if (success) {
      router.push('/dashboard');
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md p-6">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-primary-700 mb-2">Gestão de Mudança</h1>
      <p class="text-gray-600">Create an account to get started</p>
    </div>
    
    <div class="card">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Register</h2>
      
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="yourname"
            required
          />
        </div>
        
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
        
        <div class="mb-4">
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
        
        <div class="mb-6">
          <label for="confirm-password" class="form-label">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
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
              Registering...
            </template>
            <template v-else>
              Register
            </template>
          </button>
          
          <div class="text-center text-gray-600 text-sm">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:text-primary-800">Log in</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>