<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { supabase, getArticles, formatDate } from './supabase';

const headerRoutes = ref([
  { link: "/homepage/", name: "Start" },
  { link: "/homepage/other/", name: "Other" }
]);

const darkmode = ref(false);
const selectedHeaderRouteIndex = ref(0);
const openPanel = ref(false);
const openWindowX = ref(false);

const redirectTo = (url) => {
  window.open(url, '_blank');
}

const primary_color = ['#f0f0f0', '#333333'];
const secondary_color = ['#fffffff5', '#2f2f2ff5'];
const font_color = ['black', 'white'];

const updateDarkmode = () => {
  const i = darkmode.value ? 1 : 0;
  const root = document.documentElement;

  root.style.setProperty('--primary-color', primary_color[i]);
  root.style.setProperty('--secondary-color', secondary_color[i]);
  root.style.setProperty('--font-color',  font_color[i]);
}

const cDarkmode = () => {
  darkmode.value = !darkmode.value;
  updateDarkmode();
  localStorage.setItem('darkMode', darkmode.value);
}

function getSystemInfo() {
  const platform = navigator.platform;
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;
  console.log("System Information:", {platform, userAgent, vendor});
}

const dbArticles = ref([]);

onMounted(async () => {
  openWindowX.value = true;

  darkmode.value = localStorage.getItem('darkMode') === 'true';
  updateDarkmode();

  getSystemInfo();
  dbArticles.value = await getArticles();
});

const translateX = ref(0);
const translateY = ref(100);
let isDragging = false;
let initialMouseX = 0;
let initialMouseY = 0;
let initialTranslateX = 0;
let initialTranslateY = 100;

const startDrag = (event) => {
  isDragging = true;
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  initialTranslateX = translateX.value;
  initialTranslateY = translateY.value;
  document.addEventListener("mousemove", dragWindow);
  document.addEventListener("mouseup", stopDrag);
};

const dragWindow = (event) => {
  if (isDragging) {
    const bodyRect = document.body.getBoundingClientRect();
    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;
    console.log(deltaX);
    translateX.value = initialTranslateX + (deltaX / bodyRect.width) * 200;
    translateY.value = initialTranslateY + (deltaY / bodyRect.height) * 200;
  }
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", dragWindow);
  document.removeEventListener("mouseup", stopDrag);
};


onUnmounted(() => {
  document.removeEventListener("mousemove", dragWindow);
  document.removeEventListener("mouseup", stopDrag);
});

const MAX_PREVIEW_LENGTH = 100;
const truncate_preview = (article_content) => {
  return article_content.length > MAX_PREVIEW_LENGTH  ? article_content.substring(0, MAX_PREVIEW_LENGTH ) + "..." : article_content;
}

</script>

<template>
  <div class="header">
    <div class="header-item header-user" @click="redirectTo('https://github.com/Ravry')">
      <i class="fa-brands fa-github"></i>
      |
      <span>u/Ravry</span>
    </div>

    <div class="header-routes">
      <div v-for="(route, index) in headerRoutes" :key="index">
        <RouterLink 
          :to="route.link" 
          :class="selectedHeaderRouteIndex === index ? 'active-route' : 'inactive-route'"  
          @click="selectedHeaderRouteIndex = index"
        >
          <span class="header-item"> {{ route.name }} </span>
        </RouterLink>
      </div>
    </div>

    <div class="panel-background" v-if="openPanel || openWindowX" @click="openPanel=false; openWindowX = false;"></div>
    <transition name="fade">
      <div class="panel" v-if="openPanel">
        <div class="panel-container">
          <div class="panel-topbar">
            <div class="btn" @click="openPanel=false">
              <i class="fa-solid fa-house"></i>
            </div>
          </div>

          <div class="panel-content">                
            <div v-for="article in dbArticles" class="panel-content-item">
              <h2>{{ article.title }}</h2>
              <p>{{ article.content }}</p>
              <p v-if="article.article_content">{{ truncate_preview(article.article_content[0].content) }}</p>
              <p class="timestamp">{{ formatDate(article.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="window-xp" v-if="openWindowX" :style="`transform: translate(${translateX}%, ${translateY}%); position: absolute;`">
        <div class="topbar-xp" @mousedown="startDrag">
          <div>Local Disk (C:)</div>
          <div class="close-xp" @click="openWindowX = false">x</div>
        </div>
        <div class="content-xp">
          <div class="text-xp">
            <i style="font-size: 5vw; flex-grow: 1; color: red;" class="fa-solid fa-circle-exclamation"></i>
            <div style="flex-grow: 4;">
              <p style="margin: 2px; color: black;">Traceback (most recent call last):</p>
              <p style="margin: 2px; color: black;" >&nbsp;&nbsp;File C:\Ravry is accessible</p>
              <p style="margin: 2px; color: black;">&nbsp;&nbsp;File C:\Ravry Access granted</p>
              <p style="margin: 2px; color: black;">SystemExit: 0.</p>
            </div>
          </div>
          <div class="button-xp" @click="openWindowX = false">
            <div class="button-text-xp">OK</div>
          </div>
        </div>
      </div>
    </transition>
    

    <div class="header-buttons">
      <div class="btn header-item" @click="cDarkmode()">
        <i :class="darkmode === false ? 'fa-solid fa-moon' : 'fa-solid fa-lightbulb'"></i>
      </div>
      <div class="btn header-item" @click="openPanel = true">
        <div class="notification" v-if="dbArticles.length > 0"> {{ dbArticles.length }} </div>
        <i class="fa-solid fa-envelope"></i>
      </div>
    </div>
    
  </div>

  <RouterView/>
</template>