<template>
  <div class="container py-4">
    <!-- User Profile Card -->
    <div class="card mb-4">
      <div class="card-body text-center">
        <img :src="user.avatar" class="rounded-circle mb-3" width="150" height="150" :alt="user.name">
        <h3 class="card-title">{{ user.name }}</h3>
        <p class="text-muted">{{ user.nickname }}</p>
        <p class="text-muted">{{ user.email }}</p>
      </div>
    </div>

    <!-- User Posts -->
    <h4 class="mb-4">My Posts</h4>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading posts...</p>
    </div>
    <div v-else class="row g-4">
      <div v-for="post in userPosts" :key="post._id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <div @click="router.push(`/system/detail/${post._id}`)">
            <img :src="post.coverImage" class="card-img-top" :alt="post.title">
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text text-truncate">{{ post.content }}</p>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center m-1">
            <div>
              <button class="btn btn-outline-primary me-2" @click="editPost(post)">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-outline-danger" @click="deletePost(post._id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
            <small class="text-muted">{{ formatDate(post.updatedAt) }}</small>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const router = useRouter()

const decoded = jwtDecode(localStorage.getItem('token'));
console.log(decoded);

const user = ref({
  name: decoded.first_name,
  nickname: decoded.last_name,
  email: decoded.email,
  avatar: decoded.avatar
})

const userPosts = ref([])
const loading = ref(true)

const getMyPosts = async () => {
  try {
    const response = await fetch('/api/bluenote/myPosts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const json = await response.json();
    if (response.ok) {
      userPosts.value = json;
    } else {
      alert(json.message);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    loading.value = false;
  }
}

const editPost = (post) => {
  router.push(`/system/edit/${post._id}`);
}

const deletePost = async (postId) => {
  const result = await Swal.fire({
    title: 'Confirm Delete',
    text: "Are you sure you want to delete this blog?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bluenote/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Fail to delete');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Done',
        text: 'Blog deleted',
        timer: 1500,
        showConfirmButton: false
      });

      router.go(0);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: error.message
      });
    }
  }
};

const formatDate = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffTime = Math.abs(now - postDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return postDate.toLocaleDateString();
  }
}

onMounted(() => {
  getMyPosts();
})
</script>