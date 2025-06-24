import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

// Auth
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

// Dashboard
import DashboardView from '../views/DashboardView.vue';

// Items
import ItemsView from '../views/items/ItemsView.vue';
import ItemDetailView from '../views/items/ItemDetailView.vue';
import AddItemView from '../views/items/AddItemView.vue';
import EditItemView from '../views/items/EditItemView.vue';

// Categories
import CategoriesView from '../views/categories/CategoriesView.vue';
import AddCategoryView from '../views/categories/AddCategoryView.vue';
import EditCategoryView from '../views/categories/EditCategoryView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/items',
    name: 'items',
    component: ItemsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/items/add',
    name: 'add-item',
    component: AddItemView,
    meta: { requiresAuth: true }
  },
  {
    path: '/items/:id',
    name: 'item-detail',
    component: ItemDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/items/:id/edit',
    name: 'edit-item',
    component: EditItemView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/add',
    name: 'add-category',
    component: AddCategoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/:id/edit',
    name: 'edit-category',
    component: EditCategoryView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If authentication is required but the user is not authenticated, redirect to the login page
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // If the user is already authenticated and trying to access login/register, redirect to dashboard
    next('/dashboard');
  } else {
    // Otherwise, proceed as normal
    next();
  }
});

export default router;