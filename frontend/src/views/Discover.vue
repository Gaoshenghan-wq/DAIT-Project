<template>
  <div class="container py-4">
    <div class="row g-4">
      <div v-for="post in filteredPosts" :key="post.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100" style="cursor: pointer" @click="router.push(`/detail/${post._id}`)">
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
import { ref, computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const allPosts = ref({
  image: '',
  title: '',
  userAvatar:'',
  userName:''
})

const getBlog = async function() {
  const response = await fetch('/api/bluenote/allblog');
  const json = await response.json();
  console.log(json)

  if (response.ok) {
    // set the booking
    allPosts.value = json;
  } else {
    alert(json.message);
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

onMounted(()=>{
  console.log("onmounted set")
  getBlog()
})
</script>