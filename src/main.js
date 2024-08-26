import './assets/main.css'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Home from './assets/pages/Home.vue'

const routes = [
    { path: '/', component: Home }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
