<template>
  <div class="container py-4">
    <div class="card mb-4">
      <img :src="post.coverImage" class="card-img-top" :alt="post.title">
      <div class="card-body">
        <h2 class="card-title">{{ post.title }}</h2>
        <div class="d-flex align-items-center mb-3">
          <img :src="post.author.avatar" class="rounded-circle me-2" width="40" height="40" :alt="post.userName">
          <span class="text-muted">{{ post.author.username }}</span>
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

const post = ref({})

const fetchPostDetial = async function() {
  const response = await fetch('/api/bluenote/blog/'+route.params.id);
  const data = await response.json();

  if (response.ok) {
    // set the booking
    post.value = data;
  } else {
    alert(json.message);
  }
}


const currentUser = ref({
  name: 'Current User',
  avatar: 'https://picsum.photos/seed/currentuser/100/100'
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

onMounted(()=>{
  console.log("onmounted set")
  fetchPostDetial()
})
</script>