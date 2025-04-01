<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showSidebar = ref(window.innerWidth >= 768);
const showLoginModal = ref(false);
const isAuthenticated = localStorage.getItem('token')
const searchQuery = ref('');

window.addEventListener('resize', () => {
  showSidebar.value = window.innerWidth >= 768;
});



const handleLogout = () => {
  localStorage.setItem("token", null);
  router.push('/login');
};
</script>

<template>
  <!-- Header -->
  <header class="navbar navbar-expand-lg bg-white border-bottom fixed-top">
    <div class="container-fluid">
      <!-- Logo -->
      <a class="navbar-brand" href="#" @click="router.push('/discover')">
        <img src="/logo.png" alt="Logo" width="90" height="30">
      </a>

      <!-- Search Bar -->
      <div class="d-flex flex-grow-1 justify-content-center">
        <div class="input-group" style="max-width: 500px;">
          <input 
            type="search" 
            class="form-control" 
            placeholder="Search posts..." 
            v-model="searchQuery"
          >
          <button class="btn btn-outline-secondary">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <div class="container-fluid" style="margin-top: 56px;">
    <div class="row">
      <!-- Left Sidebar - Hidden on mobile -->
      <div v-if="showSidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: $route.path === '/discover' }" @click="router.push('/system/discover')">
                <i class="bi bi-compass"></i> Discover
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: $route.path === '/post' }" @click="router.push('/system/post')">
                <i class="bi bi-plus-square"></i> Post
              </a>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" :class="{ active: $route.path === '/me' }" @click="router.push('/system/me')">
                <i class="bi bi-person"></i> Me
              </a>
            </li>
            <li class="nav-item" v-else>
              <a class="nav-link" @click="showLoginModal = true">
                <i class="bi bi-box-arrow-in-right"></i> Login
              </a>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Main Content -->
      <main class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
        <router-view :search-query="searchQuery"></router-view>
      </main>
    </div>

    <!-- Bottom Navigation - Visible only on mobile -->
    <nav class="d-md-none fixed-bottom bg-white border-top">
      <div class="row text-center">
        <div class="col">
          <a @click="router.push('/discover')" class="nav-link" :class="{ active: $route.path === '/discover' }">
            <i class="bi bi-compass"></i>
            <div>Discover</div>
          </a>
        </div>
        <div class="col">
          <a @click="router.push('/post')" class="nav-link" :class="{ active: $route.path === '/post' }">
            <i class="bi bi-plus-square"></i>
            <div>Post</div>
          </a>
        </div>
        <div class="col" v-if="isAuthenticated">
          <a @click="router.push('/me')" class="nav-link" :class="{ active: $route.path === '/me' }">
            <i class="bi bi-person"></i>
            <div>Me</div>
          </a>
        </div>
        <div class="col" v-else>
          <a @click="showLoginModal = true" class="nav-link">
            <i class="bi bi-box-arrow-in-right"></i>
            <div>Login</div>
          </a>
        </div>
      </div>
    </nav>
  </div>

</template>

<style>

.sidebar {
  position: fixed;
  top: 56px;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.nav-link {
  color: #333;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.nav-link:hover {
  color: #0d6efd;
}

.nav-link.active {
  color: #0d6efd;
}

.nav-link i {
  margin-right: 0.5rem;
}

@media (max-width: 767.98px) {
  main {
    margin-bottom: 80px;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  width: 100%;
  max-width: 400px;
  margin: 1.75rem auto;
  background: white;
  border-radius: 5px;
  padding: 10px;
}
</style>