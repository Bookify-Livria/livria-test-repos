<script>
import LanguageSwitcher from "../../public/components/language-switcher.component.vue";
import { UserApiService } from "@/subscription/service/user-api.service.js";

export default {
  name: "DashboardSidebar",
  components:{
    LanguageSwitcher
  },
  emits: ['toggle-sidebar'],
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeItem: 'dashboard',
      admin: null,
      activeBottomAction: null,
      // Sidebar navigation items
      navItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'pi pi-home',
          route: '/dashboard'
        },
        {
          id: 'books',
          label: 'Books',
          icon: 'pi pi-book',
          route: '/books-management'
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: 'pi pi-shopping-cart',
          route: '/orders-management'
        }
      ]
    };
  },
  computed: {
    // Computed classes for the sidebar based on collapsed state
    sidebarClasses() {
      return {
        'sidebar-collapsed': this.collapsed
      };
    }
  },
  methods: {
    // Set active item based on current route
    updateActiveItem() {
      const currentPath = this.$router.currentRoute.value.path;
      const matchingItem = this.navItems.find(item => currentPath.includes(item.route));
      if (matchingItem) {
        this.activeItem = matchingItem.id;
        this.activeBottomAction = null; // Clear bottom action active state
      } else if (currentPath.includes('/settings')) {
        this.activeBottomAction = 'settings';
        this.activeItem = null; // Clear main nav active state
      } else if (currentPath.includes('/login')) { // For logout, if you want it active on the login page after clicking
        this.activeBottomAction = 'logout';
        this.activeItem = null; // Clear main nav active state
      } else {
        this.activeItem = null;
        this.activeBottomAction = null;
      }
    },
    // Load user information
    async fetchUserInfo() {
      try {
        const userApiService = new UserApiService();
        this.admin = await userApiService.getAdminUser(); // Update reactive data

      } catch (error) {
        console.error("Error getting user info:", error);
      }
    },
    // Navigate to the selected route
    navigateTo(item) {
      if (['settings', 'logout'].includes(item.id)) {
        this.activeBottomAction = item.id;
        this.activeItem = null; // Ensure main nav item is not active
      } else {
        this.activeItem = item.id;
        this.activeBottomAction = null; // Ensure bottom action is not active
      }

      this.$router.push(item.route);
    },
    // Toggle sidebar collapsed state
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  },
  mounted() {
    // This lifecycle hook is called after the component is mounted
    this.fetchUserInfo();
    this.updateActiveItem();
  }
};
</script>

<template>
  <div class="sidebar-container" :class="sidebarClasses">
    <div class="sidebar-toggle" @click="toggleSidebar">
      <i :class="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
    </div>

    <div class="header">
      <img alt="livria_logo" class="header__logo" src="../../assets/images/logo/logo.png" />
    </div>

    <div class="color-bar">
      <div class="color-bar__section color-bar__section--orange"></div>
      <div class="color-bar__section color-bar__section--yellow"></div>
      <div class="color-bar__section color-bar__section--light-yellow"></div>
      <div class="color-bar__section color-bar__section--dark-blue"></div>
      <div class="color-bar__section color-bar__section--light"></div>
      <div class="color-bar__section color-bar__section--teal"></div>
    </div>

    <div class="sidebar-user-profile">
      <div class="user-avatar">
        <span>{{ admin?.username?.charAt(0).toUpperCase() || 'U' }}</span>
      </div>
      <div class="user-info" v-if="!collapsed">
        <h3>{{ admin?.display }}</h3>
        <p>{{ $t('sidebar.role') }}</p>
      </div>
    </div>

    <div class="color-bar">
      <div class="color-bar__section color-bar__section--orange"></div>
      <div class="color-bar__section color-bar__section--yellow"></div>
      <div class="color-bar__section color-bar__section--light-yellow"></div>
      <div class="color-bar__section color-bar__section--dark-blue"></div>
      <div class="color-bar__section color-bar__section--light"></div>
      <div class="color-bar__section color-bar__section--teal"></div>
    </div>

    <div class="sidebar-nav">
      <ul>
        <li
            v-for="item in navItems"
            :key="item.id"
            :class="{ active: activeItem === item.id }"
            @click="navigateTo(item)"
        >
          <i :class="item.icon"></i>
          <span v-if="!collapsed">{{ $t(`sidebar.${item.id}`) }}</span>
        </li>
      </ul>
    </div>

    <div class="lang-btn">
      <LanguageSwitcher></LanguageSwitcher>
    </div>

    <div class="color-bar">
      <div class="color-bar__section color-bar__section--orange"></div>
      <div class="color-bar__section color-bar__section--yellow"></div>
      <div class="color-bar__section color-bar__section--light-yellow"></div>
      <div class="color-bar__section color-bar__section--dark-blue"></div>
      <div class="color-bar__section color-bar__section--light"></div>
      <div class="color-bar__section color-bar__section--teal"></div>
    </div>

    <div class="sidebar-actions">
      <div
          class="action-item"
          :class="{ active: activeBottomAction === 'settings' }"
          @click="navigateTo({id: 'settings', route: '/settings'})">
        <i class="pi pi-cog"></i>
        <span v-if="!collapsed">{{ $t('sidebar.settings') }}</span>
      </div>
      <div
          class="action-item"
          :class="{ active: activeBottomAction === 'logout' }"
          @click="navigateTo({id: 'logout', route: '/login'})">
        <i class="pi pi-sign-out"></i>
        <span v-if="!collapsed">{{ $t('sidebar.logout') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  background-color: var(--color-primary);
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-toggle {
  position: absolute;
  right: -15px;
  top: 20px;
  width: 30px;
  height: 30px;
  background-color: var(--color-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.sidebar-toggle i {
  color: white;
  font-size: 1rem;
}

.header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  margin: 1rem 0;
}

.header__logo {
  width: auto;
  height: 40px;
}

.sidebar-user-profile {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  width: 100%;
}

.user-avatar {
  width: 20%;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-accent-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  width: 70%;
}

.user-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
}

.user-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.8;
  color: #fff;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.sidebar-nav li:hover, .action-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav li.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-left: 4px solid var(--color-accent-orange);
}

.sidebar-nav li i {
  font-size: 1.2rem;
  margin-right: 1rem;
  min-width: 20px;
  text-align: center;
}

.sidebar-collapsed .sidebar-nav li {
  padding: 0.8rem;
  justify-content: center;
}

.sidebar-collapsed .sidebar-nav li i {
  margin-right: 0;
}

.sidebar-actions {
  padding: 1rem 0;
}

.action-item {
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.action-item i {
  font-size: 1.2rem;
  margin-right: 1rem;
  min-width: 20px;
  text-align: center;
}

.lang-btn{
  border-radius: 4px;            /* bordes más pequeños y uniformes */
  background-color: #a0c4ff;
  padding: 3px 8px;              /* menos padding para hacerlo compacto */
  font-size: 13px;               /* texto un poco más pequeño */
  display: inline-flex;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  justify-content: center;       /* centra contenido horizontal */
  align-items: center;           /* centra contenido vertical */
  width: fit-content;            /* tamaño ajustado al contenido */
  margin: 2rem auto;
}

.sidebar-collapsed .sidebar-actions .action-item {
  padding: 0.8rem;
  justify-content: center;
}

.sidebar-collapsed .action-item i {
  margin-right: 0;
}

/* For mobile devices */
@media (max-width: 768px) {
  .sidebar-container {
    width: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar-container.sidebar-active {
    transform: translateX(0);
  }

  .sidebar-collapsed {
    width: 100%;
    transform: translateX(-100%);
  }
}
</style>