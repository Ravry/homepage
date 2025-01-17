<script setup>
    import { ref, onMounted } from 'vue';

    const repositories = ref([]);


    const redirectTo = (url) => {
        window.open(url, '_blank');
    }

    const getLangStyle = (lang) => {
        if (lang)
        {
            switch(lang.toLowerCase())
            {
                case "html":
                    return {
                        backgroundColor: 'orange'
                    };
                case "c++": 
                    return {
                        backgroundColor: 'cornflowerblue'
                    };
                case "c#":
                    return {
                        backgroundColor: 'cadetblue'
                    };
                case "vue":
                    return {
                        backgroundColor: 'green'
                    };
                case "shaderlab":
                    return {
                        backgroundColor: "limegreen"
                    };
                default: 
                    return {
                        backgroundColor: 'grey'
                    };
            }   
        }
        else 
        {
            return {
                backgroundColor: 'grey'
            };
        }
    };

    const getGitHubProjects = async () => {
        const username = 'ravry';
        const url = `https://api.github.com/users/${username}/repos?per_page=100`;
        repositories.value = []

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const repos = await response.json();
            repositories.value = repos;
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    };

    onMounted(async () => {
        await getGitHubProjects();
    });
</script>


<template>
    <div class="centerbox">
        <p v-if="repositories.length === 0" style="text-align: center;">Inhalte werden geladen ...</p>
        <div class="container">
            <div class="grid-item" v-for="repo in repositories" :key="repo.id" @click="redirectTo(repo.html_url)">
                <div class="git-header">
                    <span class="git-name">{{ repo.full_name }}</span>
                    <span class="git-visibility"> {{ repo.visibility }} </span>
                </div>
                <span class="git-text">{{ repo.description }}</span>
                <div>created: {{ repo.created_at.split('T')[0] }}</div>
                <div>updated: {{ repo.updated_at.split('T')[0] }}</div>
                <div class="git-row">
                    <div class="git-lang">
                        <div class="circle" :style="getLangStyle(repo.language)"></div>
                        &nbsp;
                        <span>{{ repo.language }}</span>
                    </div>
                    <div><i class="fa-solid fa-eye"></i> {{ repo.watchers_count }}</div>
                </div>    
            </div>
        </div>
    </div>
</template>