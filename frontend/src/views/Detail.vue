<template>
  <div class="container py-4">
    <div class="card mb-4">
      <img :src="post.image" class="card-img-top" :alt="post.title">
      <div class="card-body">
        <h2 class="card-title">{{ post.title }}</h2>
        <div class="d-flex align-items-center mb-3">
          <img :src="post.userAvatar" class="rounded-circle me-2" width="40" height="40" :alt="post.userName">
          <span class="text-muted">{{ post.userName }}</span>
        </div>
        <p class="card-text">{{ post.content }}</p>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-primary me-2" @click="toggleLike">
            <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
            {{ likes }}
          </button>
          <span class="ms-3">
            <i class="bi bi-chat-dots"></i>
            {{ comments.length }} comments
          </span>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="card">
      <div class="card-body">
        <h4 class="card-title mb-4">Comments</h4>
        
        <!-- New Comment Form -->
        <div class="d-flex mb-4">
          <img :src="currentUser.avatar" class="rounded-circle me-2" width="40" height="40" :alt="currentUser.name">
          <div class="flex-grow-1">
            <div class="input-group">
              <input type="text" class="form-control" v-model="newComment" placeholder="Add a comment...">
              <button class="btn btn-primary" @click="addComment">Post</button>
            </div>
          </div>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="d-flex mb-3">
            <img :src="comment.userAvatar" class="rounded-circle me-2" width="32" height="32" :alt="comment.userName">
            <div>
              <h6 class="mb-1">{{ comment.userName }}</h6>
              <p class="mb-1">{{ comment.content }}</p>
              <small class="text-muted">{{ comment.date }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isLiked = ref(false)
const likes = ref(42)
const newComment = ref('')

const currentUser = ref({
  name: 'Current User',
  avatar: 'https://picsum.photos/seed/currentuser/100/100'
})

// Mock posts data to match with Discover page
const mockPosts = {
  1: {
    id: 1,
    title: 'Beautiful Sunset',
    content: 'A breathtaking view of the sun setting over the horizon, painting the sky in vibrant hues of orange and purple.',
    image: 'https://picsum.photos/seed/1/800/600',
    userName: 'John Doe',
    userAvatar: 'https://picsum.photos/seed/user1/100/100'
  },
  2: {
    id: 2,
    title: 'City Lights',
    content: 'The mesmerizing glow of city lights at night, creating a magical urban landscape that never sleeps.',
    image: 'https://picsum.photos/seed/2/800/600',
    userName: 'Jane Smith',
    userAvatar: 'https://picsum.photos/seed/user2/100/100'
  },
  3: {
    id: 3,
    title: 'Mountain View',
    content: 'Majestic mountains reaching towards the sky, their peaks covered in pristine snow and surrounded by clouds.',
    image: 'https://picsum.photos/seed/3/800/600',
    userName: 'Mike Johnson',
    userAvatar: 'https://picsum.photos/seed/user3/100/100'
  }
}

const post = ref(mockPosts[route.params.id] || {
  id: route.params.id,
  title: 'Post not found',
  content: 'This post does not exist.',
  image: 'https://picsum.photos/seed/404/800/600',
  userName: 'Unknown',
  userAvatar: 'https://picsum.photos/seed/unknown/100/100'
})

const comments = ref([
  {
    id: 1,
    userName: 'Alice Johnson',
    userAvatar: 'https://picsum.photos/seed/user2/100/100',
    content: 'This is absolutely stunning! Love the composition.',
    date: '2 hours ago'
  },
  {
    id: 2,
    userName: 'Bob Wilson',
    userAvatar: 'https://picsum.photos/seed/user3/100/100',
    content: 'Great shot! What camera did you use?',
    date: '1 hour ago'
  }
])

const toggleLike = () => {
  isLiked.value = !isLiked.value
  likes.value += isLiked.value ? 1 : -1
}

const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: comments.value.length + 1,
      userName: currentUser.value.name,
      userAvatar: currentUser.value.avatar,
      content: newComment.value,
      date: 'Just now'
    })
    newComment.value = ''
  }
}
</script>