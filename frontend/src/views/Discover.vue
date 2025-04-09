<template>
  <div class="container py-4">
    <!-- Loading state - added at the top -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading posts...</p>
    </div>

    <!-- Rest of your existing template remains unchanged -->
    <div v-else class="row g-4">
      <div v-for="post in posts" :key="post.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100" style="cursor: pointer" @click="router.push(`/system/detail/${post._id}`)">
          <img :src="post.coverImage" class="card-img-top" :alt="post.title">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <div class="d-flex align-items-center mt-2">
              <img :src="post.author.avatar" class="rounded-circle me-2" width="30" height="30" :alt="post.userName">
              <span class="text-muted">{{ post.author.username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav v-if="totalPages > 1" aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="prevPage" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" @click="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 9
const posts = ref([])
const totalPages = ref(0)

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const getBlog = async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/bluenote/allPost?page=${currentPage.value}&limit=${itemsPerPage}&search=${props.searchQuery}`)
    const json = await response.json()
    if (response.ok) {
      posts.value = json.data
      totalPages.value = json.totalPages
    } else {
      alert(json.message)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getBlog()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    getBlog()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  getBlog()
}

watch(() => props.searchQuery, () => {
  currentPage.value = 1
  getBlog()
})

onMounted(() => {
  getBlog()
})
</script>