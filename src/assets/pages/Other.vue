<script setup>
import { ref, onMounted } from 'vue';
import { getArticles, formatDate, getCommentsFromArticle, addCommentToArticle, addArticle } from '@/supabase';
import CryptoJS from 'crypto-js';

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

const write_article = ref(false);
const article_password = ref('')
const article_title = ref('');
const article_description = ref('');
const article_contents = ref([]);

const addContentBox = async () => {
    article_contents.value.push({content: ""});
}

const sendArticle = async () => {
    if (!article_title.value || !article_description.value || !article_contents.value)
        return;

    const sha256 = 'c0ba9984db0d5f970bdd3aabd83655faef7029a08fca6ac3f880d302ffb66c0b';
    const shad256_password = CryptoJS.SHA256(article_password.value).toString();

    if (shad256_password === sha256)
    {
        await addArticle(article_title.value, article_description.value, article_contents.value);   
        dbArticles.value = await getArticles();
    }
     
    article_password.value = '';
    article_title.value = '';
    article_description.value = '';
    article_contents.value = [];
    write_article.value = false;
}

</script>

<template>
    <div class="centerbox" style="justify-content: start;">
        <div class="other-container" v-if="!selected_article && !write_article">
            <div class="btn" @click="write_article = true">
              <i class="fa-solid fa-plus"></i>
            </div>

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
            <div v-for="article_content in selected_article.article_content">
                <p>{{ article_content.content }}</p>
                <img v-if="article_content.img" :src="article_content.img" :alt="article_content.img"></img>
            </div>
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

        
        <div class="article-container" v-if="write_article">
            <div class="btn" @click="write_article = false">
              <i class="fa-solid fa-house"></i>
            </div>
            <div class="comment-form">
                <input type="password" placeholder="password ..." class="comment-input" maxlength="20" v-model="article_password">
                <input type="text" placeholder="title ..." class="comment-input" maxlength="20" v-model="article_title">
                <input type="text" placeholder="description ..." class="comment-input" maxlength="500" v-model="article_description">
                <div class="content-image-compund" v-for="(content, index) in article_contents" :key="index">
                    <textarea class="article-content-writer" placeholder="content..." rows="5" v-model="content.content"></textarea>
                    <input type="text" placeholder="img ..." class="comment-input" v-model="content.img">
                </div>
                <button class="comment-btn" @click="addContentBox()">+</button>
                <button class="comment-btn" @click="sendArticle()">submit</button>    
            </div>
        </div>
        
    </div>
</template>