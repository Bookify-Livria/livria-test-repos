<template>
  <div class="community-view fantasy-theme">
    <div v-if="loading" class="loading">
      <p>Cargando comunidad...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="community-container">
      <!-- Community Header -->
      <div class="community-header">
        <div class="community-logo">
          <img :src="community.image || '/api/placeholder/200/200'" alt="Logo de la comunidad">
        </div>
        <div class="community-header-content">
          <h1 class="community-title">{{ community.name }}</h1>
          <div class="community-category">{{ community.type }}</div>
          <p class="community-description">{{ community.description }}</p>
          <button class="join-btn" @click="joinCommunity" v-if="!isJoined">UNIRSE +</button>
          <button class="leave-btn" @click="leaveCommunity" v-else>SALIR</button>
        </div>
      </div>

      <!-- Post Creation -->
      <div class="post-creation">
        <textarea
            v-model="newPost"
            placeholder="¿En qué estás pensando?"
            class="post-input"
        ></textarea>
        <div class="post-actions">
          <button class="attach-btn">
            <i class="fas fa-image"></i>
          </button>
          <button class="publish-btn" @click="createPost" :disabled="!newPost.trim()">
            PUBLICAR
          </button>
        </div>
      </div>

      <!-- Posts List -->
      <div class="posts-section">
        <div v-if="posts.length === 0" class="no-posts">
          <p>No hay publicaciones aún. ¡Sé el primero en compartir algo!</p>
        </div>

        <div v-else class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-card">
            <div class="post-author">
              <div class="author-username">@{{ getUserById(post.userId).user.replace('@', '') }}</div>
              <div class="post-content">{{ post.content }}</div>
              <div v-if="post.image" class="post-image">
                <img :src="post.image" alt="Imagen de la publicación">
              </div>
            </div>

            <div class="post-footer">
              <button class="like-btn" @click="likePost(post.id)" :class="{ active: isLiked(post.id) }">
                <i class="fas fa-heart"></i>
              </button>
              <button class="comment-btn" @click="toggleComments(post.id)">
                <i class="fas fa-comment"></i>
              </button>
            </div>

            <!-- Comments Section -->
            <div v-if="expandedPostId === post.id" class="comments-section">
              <div class="comment-input">
                <input
                    v-model="commentText"
                    placeholder="Escribe un comentario..."
                    @keydown.enter="addComment(post.id)"
                />
                <button @click="addComment(post.id)" :disabled="!commentText.trim()">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>

              <div class="comments-list">
                <div v-for="comment in post.comments" :key="comment.id" class="comment">
                  <div class="comment-author">@{{ getUserById(comment.userId).user.replace('@', '') }}</div>
                  <div class="comment-text">{{ comment.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { CommunityApiService } from '../service/community-api.service.js';

export default {
  name: 'CommunityView',

  setup() {
    const route = useRoute();
    const communityId = route.params.id;
    const communityService = new CommunityApiService();

    // State
    const loading = ref(true);
    const error = ref(null);
    const community = ref({});
    const posts = ref([]);
    const users = ref([]);
    const membersCount = ref(0);
    const isJoined = ref(false);
    const newPost = ref('');
    const commentText = ref('');
    const expandedPostId = ref(null);

    // Current user (would come from auth state in a real app)
    const currentUser = ref({
      id: '1',
      display: 'King Turkey',
      user: '@kingturkey',
      email: 'kingturkey@gmail.com',
      icon: 'https://img.freepik.com/premium-photo/turkey-is-depicted-wearing-luxurious-red-white-cape-adorned-with-jeweled-crown_1115583-48702.jpg'
    });

    // Methods
    const fetchCommunityData = async () => {
      try {
        loading.value = true;

        // Fetch community data
        const communityData = await fetch(`http://localhost:3000/communities/${communityId}`)
            .then(res => res.json());
        community.value = communityData;

        // Fetch community posts
        const postsData = await fetch(`http://localhost:3000/posts?communityId=${communityId}`)
            .then(res => res.json());
        posts.value = postsData;

        // Fetch all users
        const usersData = await fetch('http://localhost:3000/users')
            .then(res => res.json());
        users.value = usersData;

        // Fetch community members
        const membersData = await fetch(`http://localhost:3000/communityMembers?communityId=${communityId}`)
            .then(res => res.json());
        membersCount.value = membersData.length;

        // Check if current user is a member
        isJoined.value = membersData.some(member => member.userId === currentUser.value.id);

        loading.value = false;
      } catch (err) {
        error.value = 'Error al cargar la comunidad: ' + err.message;
        loading.value = false;
      }
    };

    const getUserById = (userId) => {
      return users.value.find(user => user.id === userId) || {
        display: 'Usuario desconocido',
        user: '@unknown',
        icon: 'https://via.placeholder.com/50'
      };
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const joinCommunity = async () => {
      try {
        const memberData = {
          userId: currentUser.value.id,
          communityId: communityId,
          joinedAt: new Date().toISOString()
        };

        await fetch('http://localhost:3000/communityMembers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(memberData)
        });

        isJoined.value = true;
        membersCount.value++;
      } catch (err) {
        console.error('Error al unirse a la comunidad:', err);
      }
    };

    const leaveCommunity = async () => {
      try {
        const membershipId = await fetch(`http://localhost:3000/communityMembers?userId=${currentUser.value.id}&communityId=${communityId}`)
            .then(res => res.json())
            .then(data => data[0]?.id);

        if (membershipId) {
          await fetch(`http://localhost:3000/communityMembers/${membershipId}`, {
            method: 'DELETE'
          });

          isJoined.value = false;
          membersCount.value--;
        }
      } catch (err) {
        console.error('Error al salir de la comunidad:', err);
      }
    };

    const createPost = async () => {
      if (!newPost.value.trim()) return;

      try {
        const postData = {
          communityId: communityId,
          userId: currentUser.value.id,
          content: newPost.value,
          createdAt: new Date().toISOString(),
          likes: [],
          comments: []
        };

        const response = await fetch('http://localhost:3000/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }).then(res => res.json());

        posts.value.unshift(response);
        newPost.value = '';
      } catch (err) {
        console.error('Error al crear publicación:', err);
      }
    };

    const toggleComments = (postId) => {
      expandedPostId.value = expandedPostId.value === postId ? null : postId;
      commentText.value = '';
    };

    const addComment = async (postId) => {
      if (!commentText.value.trim()) return;

      try {
        const post = posts.value.find(p => p.id === postId);

        if (!post) return;

        const commentData = {
          userId: currentUser.value.id,
          text: commentText.value,
          createdAt: new Date().toISOString()
        };

        if (!post.comments) {
          post.comments = [];
        }

        post.comments.push(commentData);

        await fetch(`http://localhost:3000/posts/${postId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comments: post.comments })
        });

        commentText.value = '';
      } catch (err) {
        console.error('Error al añadir comentario:', err);
      }
    };

    const likePost = async (postId) => {
      try {
        const post = posts.value.find(p => p.id === postId);
        if (!post) return;

        if (!post.likes) {
          post.likes = [];
        }

        const userLiked = post.likes.includes(currentUser.value.id);

        if (userLiked) {
          post.likes = post.likes.filter(id => id !== currentUser.value.id);
        } else {
          post.likes.push(currentUser.value.id);
        }

        await fetch(`http://localhost:3000/posts/${postId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ likes: post.likes })
        });
      } catch (err) {
        console.error('Error al dar like:', err);
      }
    };

    const isLiked = (postId) => {
      const post = posts.value.find(p => p.id === postId);
      return post?.likes?.includes(currentUser.value.id) || false;
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchCommunityData();
    });

    return {
      loading,
      error,
      community,
      posts,
      membersCount,
      isJoined,
      newPost,
      commentText,
      expandedPostId,
      currentUser,
      getUserById,
      formatDate,
      joinCommunity,
      leaveCommunity,
      createPost,
      toggleComments,
      addComment,
      likePost,
      isLiked
    };
  }
};
</script>

<style scoped>
/* Reseteo y estilos generales */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

.community-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  background-image: url('/api/placeholder/1200/800');
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
}

.fantasy-theme {
  font-family: var(--font-primary)
}

.loading, .error {
  text-align: center;
  padding: 100px 0;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  margin: 20px;
}

/* Header de la comunidad */
.community-header {
  display: flex;
  padding: 20px;
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  align-items: center;
}

.community-logo {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.community-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-header-content {
  flex: 1;
}

.community-title {
  color: #114B5F;
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.community-category {
  display: inline-block;
  background-color: #FFD166;
  color: #333;
  font-size: 0.8rem;
  padding: 3px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 10px;
}

.community-description {
  color: #666;
  margin-bottom: 15px;
  max-width: 90%;
}

.join-btn, .leave-btn {
  background-color: #5DD39E;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.leave-btn {
  background-color: #888;
}

.join-btn:hover {
  background-color: #4BC18B;
}

.leave-btn:hover {
  background-color: #666;
}

/* Creación de posts */
.post-creation {
  background-color: white;
  border-radius: 8px;
  margin: 20px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.post-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  min-height: 80px;
  margin-bottom: 10px;
  resize: none;
  font-family: inherit;
}

.post-actions {
  display: flex;
  justify-content: space-between;
}

.attach-btn {
  background-color: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 1.2rem;
}

.publish-btn {
  background-color: #FFB627;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
}

.publish-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Lista de posts */
.posts-section {
  padding: 0 20px;
}

.no-posts {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.post-author {
  margin-bottom: 10px;
}

.author-username {
  color: #114B5F;
  font-weight: bold;
  margin-bottom: 8px;
}

.post-content {
  margin-bottom: 10px;
  line-height: 1.5;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.post-footer {
  display: flex;
  border-top: 1px solid #eee;
  padding-top: 10px;
  gap: 15px;
}

.like-btn, .comment-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  gap: 5px;
}

.like-btn.active {
  color: #FF5A5F;
}

/* Comentarios */
.comments-section {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.comment-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #eee;
  border-radius: 20px;
  font-family: inherit;
}

.comment-input button {
  background: transparent;
  border: none;
  color: #114B5F;
  cursor: pointer;
}

.comment-input button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 10px;
}

.comment-author {
  font-weight: bold;
  color: #114B5F;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.comment-text {
  font-size: 0.95rem;
}
</style>