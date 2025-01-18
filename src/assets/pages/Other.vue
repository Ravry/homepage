<script setup>
import { ref, onMounted } from 'vue';
import { getArticles, formatDate, getCommentsFromArticle, addCommentToArticle } from '@/supabase';

const selected_article = ref(null);

const dbArticles = ref([]);
onMounted(async () => {
    dbArticles.value = await getArticles();
});

const selectedArticleComments = ref(null)
const selectArticle = async (article) => {
    selected_article.value = article;

    if (!selected_article.value)
        return;

    selectedArticleComments.value = await getCommentsFromArticle(selected_article.value.id)
}

const comment_tooltip = ref('')
const comment_user = ref('');
const comment_content = ref('');
const sendComment = async () => {     
    if (!comment_user.value || !comment_content.value) {
        comment_tooltip.value = 'failed ... please enter a valid name or comment.';
        return;
    }

    const user = comment_user.value;
    const content = comment_content.value;

    comment_tooltip.value = '';
    comment_user.value = '';
    comment_content.value = '';
    await addCommentToArticle(selected_article.value.id, user, content);
    selectedArticleComments.value = await getCommentsFromArticle(selected_article.value.id)
}

</script>

<template>
    <div class="centerbox" style="justify-content: start;">
        <div class="other-container" v-if="!selected_article">
            <div class="other-item" v-for="article in dbArticles" @click="selectArticle(article)">
                <img :src="article.img" class="other-image">
                <div class="other-text" style="width: 100%">
                    <span class="other-title">{{ article.title }}</span>
                    <span>{{ article.content }}</span>
                    <span class="timestamp">{{ formatDate(article.created_at) }}</span>
                </div>
            </div>
            <p v-if="dbArticles.length === 0" style="text-align: center;">Oops! It looks like there's no content available right now ... please check back later!</p>
        </div>

        <div class="article-container" v-if="selected_article">
            <div class="btn" @click="selectArticle(null)">
              <i class="fa-solid fa-house"></i>
            </div>
            <h1>{{ selected_article.title }}</h1>
            <p v-for="article_content in selected_article.article_content">{{ article_content.content }}</p>
            <p class="timestamp">{{ formatDate(selected_article.created_at) }}</p>
            <div style="border-bottom: 4px solid grey;"></div>
            
            <p>comments: <span v-if="selectedArticleComments">{{ selectedArticleComments.length }}</span></p>
            
            <div class="comment-form">
                <input type="text" placeholder="username ..." class="comment-input" maxlength="20" v-model="comment_user">
                <input type="text" placeholder="comment ..." class="comment-input" maxlength="500" v-model="comment_content">
                <p v-if="comment_tooltip">{{ comment_tooltip }}</p>
                <button class="comment-btn" @click="sendComment()">Submit</button>    
            </div>

            <div class="article-comments" v-if="selectedArticleComments">
                <div class="article-comment" v-for="comment in selectedArticleComments">
                    <div class="article-comment-header">
                        <div class="article-comment-header-user">@{{ comment.user }}</div> 
                        <div class="timestamp" style="font-weight: normal;">{{ formatDate(comment.created_at) }}</div>
                    </div>
                    
                    <p>{{ comment.content }}</p>
                    <div><i class="fa-regular fa-heart"></i> {{ comment.likes }} </div>
                </div>
                <p v-if="selectedArticleComments.length === 0" style="text-align: center; font-style: italic;" class="timestamp">pretty empty here ... be the first to comment.</p>
            </div>
        </div>
    </div>
</template>