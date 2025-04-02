<template>
  <div class="container py-4">
    <!-- Loading state - added at the top -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading posts...</p>
    </div>

    <!-- Rest of your existing template remains unchanged -->
    <div v-else class="row g-4">
      <div v-for="post in filteredPosts" :key="post.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100" style="cursor: pointer" @click="router.push(`/system/detail/${post._id}`)">
          <img :src="post.image" class="card-img-top" :alt="post.title">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <div class="d-flex align-items-center mt-2">
              <img :src="post.userAvatar" class="rounded-circle me-2" width="30" height="30" :alt="post.userName">
              <span class="text-muted">{{ post.userName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false) // Added loading ref

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const allPosts = ref({
  image: '',
  title: '',
  userAvatar: '',
  userName: ''
})

const getBlog = async function () {
  loading.value = true // Set loading to true when starting fetch
  try {
    const response = await fetch('/api/bluenote/allblog');
    const json = await response.json();
    console.log(json)

    if (response.ok) {
      allPosts.value = json;
    } else {
      alert(json.message);
    }
  } finally {
    loading.value = false // Set loading to false when done
  }
}

const filteredPosts = computed(() => {
  if (!props.searchQuery) return allPosts.value

  const query = props.searchQuery.toLowerCase()
  return allPosts.value.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.userName.toLowerCase().includes(query)
  )
})

onMounted(() => {
  console.log("onmounted set")
  getBlog()
})
</script>