import './assets/main.css'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Home from './assets/pages/Home.vue'
import Tutorials from './assets/pages/Tutorials.vue'

const routes = [
    { path: '/Homepage/Homepage/', component: Home },
    { path: '/Homepage/', component: Home },
    { path: '/Homepage/Anderes/', component: Tutorials}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
