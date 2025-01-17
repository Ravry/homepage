<script setup>
import { ref, onMounted } from 'vue';
import { getArticles, formatDate } from '@/supabase';

const dbArticles = ref([]);
onMounted(async () => {
    dbArticles.value = await getArticles();
});


</script>

<template>
    <div class="centerbox" style="justify-content: start;">
        <div class="other-container">
            <div class="other-item" v-for="article in dbArticles">
                <img :src="article.img" class="other-image">
                <div class="other-text" style="width: 100%">
                    <span class="other-title">{{ article.title }}</span>
                    <span>{{ article.content }}</span>
                    <span class="timestamp">{{ formatDate(article.created_at) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>