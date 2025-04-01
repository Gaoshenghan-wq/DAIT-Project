import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';
import Me from '../views/Me.vue';
import Post from '../views/Post.vue';
import Discover from '../views/Discover.vue';
import Register from '../views/Register.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
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
                    redirect: { name: 'Discover' }
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        }
    ]
})

export default router