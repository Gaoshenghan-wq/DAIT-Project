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
    <div class="row g-4">
      <div v-for="post in userPosts" :key="post.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <img :src="post.image" class="card-img-top" :alt="post.title">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text text-truncate">{{ post.content }}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button class="btn btn-outline-primary me-2" @click="editPost(post)">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-outline-danger" @click="deletePost(post.id)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
              <small class="text-muted">{{ post.date }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from "jwt-decode";
const router = useRouter()

const decoded = jwtDecode(localStorage.getItem('token'));
console.log(decoded);

const user = ref({
  name: decoded.first_name,
  nickname: decoded.last_name,
  email: decoded.email,
  avatar: 'https://picsum.photos/seed/user1/200/200'
})

const userPosts = ref([
  {
    id: 1,
    title: 'My Adventure',
    content: 'An amazing journey through the mountains...',
    image: 'https://picsum.photos/seed/post1/800/600',
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'City Exploration',
    content: 'Discovering hidden gems in the city...',
    image: 'https://picsum.photos/seed/post2/800/600',
    date: '1 week ago'
  }
])

const editPost = (post) => {
  // Here you would typically navigate to an edit page or show an edit modal
  console.log('Editing post:', post)
}

const deletePost = (postId) => {
  if (confirm('Are you sure you want to delete this post?')) {
    userPosts.value = userPosts.value.filter(post => post.id !== postId)
  }
}
</script>