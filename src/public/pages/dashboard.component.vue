<script>
import { ref } from 'vue'
import libraryDashboard from "../../manager/components/library-dashboard.component.vue"
import dashboardSidebar from "../../manager/components/dashboard-sidebar.component.vue"
import { getLoggedInUser } from "../shared-services/get-logged-user.js"

export default {
  name: "dashboard.component",
  components: {
    libraryDashboard,
    dashboardSidebar
  },
  setup() {
    const userInfo = ref(null);
    const loading = ref(true);
    const sidebarCollapsed = ref(false);

    const fetchUserInfo = async () => {
      try {
        loading.value = true;
        const user = await getLoggedInUser();
        userInfo.value = user;
      } catch (error) {
        console.error("Error getting user info:", error);
      } finally {
        loading.value = false;
      }
    };

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    fetchUserInfo();

    return {
      userInfo,
      loading,
      sidebarCollapsed,
      toggleSidebar
    };
  }
}
</script>

<template>
  <div class="dashboard-page" :class="{ 'sidebar-expanded': !sidebarCollapsed }">
    <dashboardSidebar
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
    />

    <div class="main-content">
      <div v-if="loading" class="loading-container">
        <p>{{ $t('loading') || 'Loading your dashboard...' }}</p>
      </div>

      <div v-else>
        <libraryDashboard/>
      </div>

    </div>
  </div>
</template>

<style scoped>

.dashboard-page {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 70px;
  transition: margin-left 0.3s ease;
  width: 100%;
}

.sidebar-expanded .main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
}

.dashboard-welcome-container {
  background-color: var(--color-primary);
  padding: 2rem 0;
  text-align: center;
  margin-top: 4.5rem;
}

.dashboard-welcome {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
}

.dashboard-welcome h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.dashboard-welcome p {
  font-size: 1.2rem;
  opacity: 0.8;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-top: 4.5rem;
}

/* For mobile devices */
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