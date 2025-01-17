import './assets/main.css'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Home from './assets/pages/Home.vue'
import Other from './assets/pages/Other.vue'

const routes = [
    { path: '/homepage/homepage/', component: Home },
    { path: '/homepage/', component: Home },
    { path: '/homepage/other/', component: Other}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
