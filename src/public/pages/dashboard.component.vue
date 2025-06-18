<script>
import dashboardSidebar from "../../manager/components/dashboard-sidebar.component.vue";
// import { getLoggedInUser } from "../shared-services/get-logged-user.js"; // No longer needed
import { UserApiService } from "@/subscription/service/user-api.service.js"; // Import your UserApiService

export default {
  name: "dashboard.component",
  components: {
    dashboardSidebar
  },
  data() {
    return {
      // Reactive data properties
      admin: null,
      loading: true,
      sidebarCollapsed: false,
    };
  },
  computed: {
    // Computed property for main content class, if needed
    mainContentClasses() {
      return {
        'sidebar-expanded': !this.sidebarCollapsed
      };
    }
  },
  methods: {
    // Method to fetch user information using UserApiService
    async fetchUserInfo() {
      try {
        this.loading = true;
        // Call the getLoggedInUser method from your UserApiService
        const userApiService = new UserApiService();
        this.admin = await userApiService.getAdminUser(); // Update reactive data

      } catch (error) {
        console.error("Error getting user info:", error);
        // Optionally handle error, e.g., show an error message
      } finally {
        this.loading = false;
      }
    },
    // Method to toggle the sidebar's collapsed state
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  },
  mounted() {
    // Call fetchUserInfo when the component is mounted to the DOM
    this.fetchUserInfo();
  }
};
</script>

<template>
  <div class="dashboard-page" :class="{ 'sidebar-expanded': !sidebarCollapsed }">
    <dashboardSidebar
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
    />

    <div class="main-content">
      <div v-if="loading" class="loading-container">
        <p>{{ $t('dashboard-home.loading') }}</p>
      </div>

      <div v-else class="welcome-container">
        <div class="welcome-card">
          <div class="welcome-header">
            <h1>{{ $t('dashboard-home.welcome') }}</h1>
            <p>{{ $t('dashboard-home.welcome-message') }}</p>
          </div>

          <div class="user-greeting">
            <div class="user-avatar">
              <span>{{ admin?.username?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            <div class="greeting-text">
              <h2>{{ $t('dashboard-home.hello') }}, {{ admin?.display || $t('dashboard-home.user') }}!</h2>
              <p>{{ $t('dashboard-home.role') }}: {{ $t('dashboard-home.admin') }}</p>
            </div>
          </div>

          <div class="quick-actions">
            <h3>{{ $t('dashboard-home.quick-actions') }}</h3>
            <div class="actions-grid">
              <div class="action-card" @click="$router.push('/books-management')">
                <i class="pi pi-book"></i>
                <span>{{ $t('dashboard-home.manage-books') }}</span>
              </div>
              <div class="action-card" @click="$router.push('/orders-management')">
                <i class="pi pi-shopping-cart"></i>
                <span>{{ $t('dashboard-home.manage-orders') }}</span>
              </div>
              <div class="action-card" @click="$router.push('/settings')">
                <i class="pi pi-cog"></i>
                <span>{{ $t('dashboard-home.settings') }}</span>
              </div>
            </div>
          </div>

          <div class="system-info">
            <h3>{{ $t('dashboard-home.system-info') }}</h3>
            <p>{{ $t('dashboard-home.version') }}: 1.0.0</p>
            <p>{{ $t('dashboard-home.last-login') }}: {{ new Date().toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  max-height: 100vh;
  margin-bottom: 0;
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-top: 4.5rem;
}

.welcome-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.welcome-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.welcome-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.welcome-header h1 {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 0.2rem;
}

.welcome-header p {
  font-size: 1rem;
  color: var(--color-text);
  text-align: center;
  opacity: 0.8;
}

.user-greeting {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: rgba(var(--color-blue-rgb), 0.05);
  border-radius: 10px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-accent-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.8rem;
  color: white;
  margin-right: 1.5rem;
}

.greeting-text h2 {
  font-size: 1.4rem;
  color: var(--color-primary);
}

.greeting-text p {
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.quick-actions {
  margin-bottom: 2rem;
}

.quick-actions h3 {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.action-card {
  background-color: white;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
  border-color: var(--color-accent-orange);
}

.action-card i {
  font-size: 2rem;
  color: var(--color-accent-orange);
  margin-bottom: 1rem;
}

.action-card span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
}

.system-info {
  background-color: rgba(var(--color-accent-yellow-rgb), 0.05);
  border-radius: 10px;
  padding: 1.5rem;
}

.system-info h3 {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.system-info p {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
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

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .welcome-container {
    padding: 1rem;
  }

  .welcome-header h1 {
    font-size: 1.8rem;
  }

  .user-greeting {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>