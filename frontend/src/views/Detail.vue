<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading posts...</p>
    </div>
    <div v-else class="card mb-4">
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
        <button class="btn btn-outline-secondary mt-3" @click="extractSummary">Extract Summary</button>
        <div v-if="summary" class="mt-3">
          <h5>Summary:</h5>
          <div v-if="summaryEntities.length > 0">
            <h5>Entities:</h5>
            <div v-for="entity in summaryEntities" :key="entity.dataSourceEntityId">
              <a :href="entity.url" target="_blank">{{ entity.name }}</a>
            </div>
          </div>
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
          <div v-for="(comment, index) in comments" :key="comment.id" class="d-flex mb-3">
            <img :src="comment.userAvatar" class="rounded-circle me-2" width="32" height="32" :alt="comment.userName">
            <div>
              <h6 class="mb-1">{{ comment.userName }}</h6>
              <p class="mb-1" v-if="!editMode[index]">{{ comment.content }}</p>
              <input type="text" class="form-control" v-if="editMode[index]" v-model="comments[index].content">
              <small class="text-muted">{{ comment.date }}</small>
              <button class="btn btn-sm btn-outline-primary me-1" v-if="comment.userName == currentUser.name && !editMode[index]" @click="startEdit(index)">Edit</button>
              <button class="btn btn-sm btn-outline-primary me-1" v-if="comment.userName == currentUser.name && editMode[index]" @click="saveEdit(index)">Save</button>
              <button class="btn btn-sm btn-outline-danger" v-if="comment.userName == currentUser.name" @click="deleteComment(comment._id)">Delete</button>
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
import { jwtDecode } from "jwt-decode";
const route = useRoute()
const isLiked = ref(false)
const likes = ref(0)
const newComment = ref('')
const summary = ref('')
const summaryEntities = ref([]) // 新增，用于存储实体信息
const editMode = ref([]) // 新增，用于跟踪编辑状态

const post = ref({
  _id: '',
  title: 'Loading...',
  content: '',
  coverImage: '',
  author: {
    _id: '',
    username: 'Unknown',
    avatar: 'https://picsum.photos/100/100'
  },
  tags: [],
  viewCount: 0,
  likes: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const loading = ref(true)

const currentUser = ref({
  name: `${decoded.first_name}`,
  avatar: `${decoded.avatar}`,
  email: `${decoded.email}`
})

const fetchPostDetial = async function () {
  try {
    const response = await fetch('/api/bluenote/blog/' + route.params.id);
    const data = await response.json();
    console.log(data, decoded, data.likes.indexOf(decoded.email))
    if (response.ok) {
      // set the post
      isLiked.value = data.likes.indexOf(decoded.email) !== -1
      post.value = data;
      likes.value = data.likes.length;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    loading.value = false;
  }
}

const comments = ref([])

const fetchComments = async () => {
  const response = await fetch(`/api/bluenote/blog/${route.params.id}/comments`);
  const data = await response.json();
  if (response.ok) {
    comments.value = data;
    editMode.value = new Array(comments.value.length).fill(false);
  } else {
    alert(data.message);
  }
}

const toggleLike = async () => {
  const email = currentUser.value.email;
  const url = `/api/bluenote/blog/${route.params.id}/like?email=${email}`;
  const method = isLiked.value ? 'DELETE' : 'POST';
  const response = await fetch(url, {
    method: method
  });
  const data = await response.json();
  if (response.ok) {
    isLiked.value = !isLiked.value;
    likes.value = data.post.likes.length;
  } else {
    alert(data.message);
  }
}

const addComment = async () => {
  if (newComment.value.trim()) {
    const url = `/api/bluenote/blog/${route.params.id}/comments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: currentUser.value.name,
        userAvatar: currentUser.value.avatar,
        content: newComment.value
      })
    });
    const data = await response.json();
    if (response.ok) {
      comments.value.unshift(data);
      editMode.value.unshift(false);
      newComment.value = '';
    } else {
      alert(data.message);
    }
  }
}

const extractSummary = async () => {
  const response = await fetch(`/api/bluenote/blog/${route.params.id}/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: post.value.content
    })
  });
  const data = await response.json();
  console.log(data)
  if (response.ok) {
    summary.value = data.onlySuccessful;
    summaryEntities.value = data.onlySuccessful[0].entities;
  } else {
    alert(data.message);
  }
}

const startEdit = (index) => {
  editMode.value[index] = true;
}

const saveEdit = async (index) => {
  const commentId = comments.value[index]._id;
  const url = `/api/bluenote/blog/${route.params.id}/comments/${commentId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: comments.value[index].content
    })
  });
  const data = await response.json();
  if (response.ok) {
    editMode.value[index] = false;
  } else {
    alert(data.message);
  }
}

const deleteComment = async (commentId) => {
  const url = `/api/bluenote/blog/${route.params.id}/comments/${commentId}`;
  const response = await fetch(url, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (response.ok) {
    comments.value = comments.value.filter(comment => comment._id !== commentId);
  } else {
    alert(data.message);
  }
}

onMounted(() => {
  console.log("onmounted set")
  fetchPostDetial()
  fetchComments()
})
</script>