<script>
import { ref, onMounted } from 'vue'
import editGenre from "../../manager/components/edit-genre.component.vue"
import dashboardSidebar from "../../manager/components/dashboard-sidebar.component.vue"

export default {
  name: "GenreManagementPage",
  components: {
    editGenre,
    dashboardSidebar
  },
  setup() {
    const sidebarCollapsed = ref(false);

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    return {
      sidebarCollapsed,
      toggleSidebar
    };
  }
}
</script>

<template>
  <div class="genre-management-page" :class="{ 'sidebar-expanded': !sidebarCollapsed }">
    <dashboardSidebar
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
    />

    <div class="main-content">
      <div class="page-header">
        <h1>{{ $t('genres.management') || 'Gestión de Géneros' }}</h1>
        <nav class="breadcrumb">
          <span><router-link to="/dashboard">{{ $t('sidebar.dashboard') || 'Dashboard' }}</router-link></span>
          <span class="separator">/</span>
          <span>{{ $t('sidebar.categories') || 'Categorías' }}</span>
        </nav>
      </div>

      <editGenre />
    </div>
  </div>
</template>

<style scoped>
.genre-management-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  margin-left: 70px;
  transition: margin-left 0.3s ease;
  width: calc(100% - 70px);
}

.sidebar-expanded .main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
}

.page-header {
  background-color: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #777;
}

.breadcrumb a {
  color: var(--color-accent-orange);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }

  .sidebar-expanded .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>