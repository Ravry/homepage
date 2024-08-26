<script setup>
    import { ref, onMounted } from 'vue';

    const repositories = ref([]);


    const redirectTo = (url) => {
        window.open(url, '_blank');
    }

    onMounted(async () => {
        const username = 'ravry';
        const url = `https://api.github.com/users/${username}/repos?per_page=100`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const repos = await response.json();
            console.log(repos)
            repositories.value = repos;
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    });
</script>


<template>
    <div class="centerbox">
        <div class="heading">Meine Projekte <i class="fa-brands fa-github"></i></div>
        <div class="container">
            <div class="grid-item" v-for="repo in repositories" :key="repo.id" @click="redirectTo(repo.html_url)">
                <p>{{ repo.name }}</p>
                <p style="color: cornflowerblue">{{ repo.language }}</p>
            </div>
        </div>
    </div>
</template>