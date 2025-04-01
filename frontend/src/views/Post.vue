<template>
  <div class="container py-4">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mb-4">Create New Post</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="image" class="form-label">Upload Image</label>
            <input type="file" class="form-control" id="image" accept="image/*" @change="handleImageChange">
            <div v-if="imagePreview" class="mt-2">
              <img :src="imagePreview" class="img-thumbnail" style="max-height: 200px">
            </div>
          </div>
          
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" class="form-control" id="title" v-model="title" required>
          </div>
          
          <div class="mb-3">
            <label for="content" class="form-label">Content</label>
            <textarea class="form-control" id="content" rows="5" v-model="content" required></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary">Post</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imagePreview = ref('')
const title = ref('')
const content = ref('')

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = () => {
  // Here you would typically handle the form submission
  console.log({
    title: title.value,
    content: content.value,
    image: imagePreview.value
  })
}
</script>