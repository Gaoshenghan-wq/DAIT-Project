<template>
  <div class="container py-4">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mb-4">Create New Post</h2>
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
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
import { ref } from 'vue';

const imagePreview = ref('');
const title = ref('');
const content = ref('');
const imageFile = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    imageFile.value = file;
  }
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', content.value);
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch('/api/bluenote/newpost', {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('Post created successfully:', result);
    // 清空表单
    title.value = '';
    content.value = '';
    imagePreview.value = '';
    imageFile.value = null;
    const fileInput = document.getElementById('image');
    fileInput.value = '';
  } catch (error) {
    console.error('Error creating post:', error);
  }
};
</script>