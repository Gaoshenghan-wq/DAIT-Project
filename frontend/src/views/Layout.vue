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
      <a class="navbar-brand ms-5" href="#" @click="router.push('/system/discover')">
        <img src="/logo.png" alt="Logo" width="90" height="40">
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
      <!-- Left Sidebar Hidden on mobile -->
      <div v-if="showSidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" :class="{ 'text-primary': $route.path === '/system/discover' }" @click="router.push('/system/discover')">
                <i class="bi bi-compass"></i> Discover
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'text-primary': $route.path === '/system/post' }" @click="router.push('/system/post')">
                <i class="bi bi-plus-square"></i> Post
              </a>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" :class="{ 'text-primary': $route.path === '/system/me' }" @click="router.push('/system/me')">
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

    <!-- Bottom navigation, only can see on mobile size -->
    <nav class="d-md-none fixed-bottom bg-white border-top">
      <div class="row text-center">
        <div class="col">
          <a @click="router.push('/system/discover')" class="nav-link" :class="{ 'text-primary': $route.path === '/system/discover' }">
            <i class="bi bi-compass"></i>
            <div>Discover</div>
          </a>
        </div>
        <div class="col">
          <a @click="router.push('/system/post')" class="nav-link" :class="{ 'text-primary': $route.path === '/system/post' }">
            <i class="bi bi-plus-square"></i>
            <div>Post</div>
          </a>
        </div>
        <div class="col" v-if="isAuthenticated">
          <a @click="router.push('/system/me')" class="nav-link" :class="{ 'text-primary': $route.path === '/system/me' }">
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
  color: #333 !important;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.nav-link:hover {
  opacity: 0.8;
  background-color: rgba(0, 0, 0, 0.05);

}

.nav-link.text-primary {
  color: #0d6efd !important;
}

.nav-link i {
  margin-right: 0.5rem;
}

@media (max-width: 767.98px) {
  main {
    margin-bottom: 80px;
  }
}
</style>