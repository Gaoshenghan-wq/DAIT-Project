<template>
    <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2">Loading post...</p>
    </div>
    <div v-else>
        <div class="container py-4">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title mb-4">Edit Post</h2>
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="image" class="form-label">Upload Image</label>
                            <input type="file" class="form-control" id="image" accept="image/*"
                                @change="handleImageChange">
                            <div v-if="imagePreview" class="mt-2">
                                <img :src="imagePreview" class="img-thumbnail" style="max-height: 200px">
                            </div>
                            <div v-else-if="post.coverImage" class="mt-2">
                                <img :src="post.coverImage" class="img-thumbnail" style="max-height: 200px">
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

                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">Update</button>
                            <button type="button" class="btn btn-secondary" @click="router.push('/system/me')">Back</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import sweet alter
import Swal from 'sweetalert2';


const router = useRouter()
const route = useRoute()

const imagePreview = ref('')
const title = ref('')
const content = ref('')
const post = ref({})
const loading = ref(true)

const fetchPost = async () => {
    try {
        loading.value = true;
        const token = localStorage.getItem('token');
        const response = await fetch('/api/bluenote/blog/' + route.params.id, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        post.value = data;
        title.value = data.title;
        content.value = data.content;

        if (data.coverImage && !data.coverImage.startsWith('http')) {
            post.value.coverImage = data.coverImage;
        }

    } catch (error) {
        console.error('Error fetching post:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
        router.push('/system/me');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchPost(route.params.id);
    console.log(post)
});

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        imagePreview.value = URL.createObjectURL(file);
    }
};

const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('content', content.value);

        const fileInput = document.getElementById('image');
        if (fileInput.files[0]) {
            formData.append('image', fileInput.files[0]);
        }

        const response = await fetch(`/api/bluenote/blog/${route.params.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update post');
        }

        await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Post updated successfully',
            timer: 1500,
            showConfirmButton: false
        });

        router.push('/system/me');

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
};
</script>