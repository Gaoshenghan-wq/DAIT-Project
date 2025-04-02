import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';
import Me from '../views/Me.vue';
import Post from '../views/Post.vue';
import Discover from '../views/Discover.vue';
import Register from '../views/Register.vue';
import Detail from '@/views/Detail.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/system',
            name: 'home',
            component: Layout,
            children: [
                {
                    path: 'discover',
                    name: 'Discover',
                    component: Discover
                },
                {
                    path: 'me',
                    name: 'Me',
                    component: Me
                },
                {
                    path: 'post',
                    name: 'Post',
                    component: Post
                },
                {
                    path: '',
                    name: 'dis',
                    redirect: { name: 'Discover' }
                },
                {
                    path: 'detail/:id',
                    name: 'Detial',
                    component: Detail
                }
            ]
        }
    ]
})

export default router