<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSwitcher from "../../public/components/language-switcher.component.vue";

export default {
  name: "DashboardSidebar",
  emits: ['toggle-sidebar'],
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const router = useRouter();
    const activeItem = ref('dashboard');
    const userInfo = ref(null);

    // Sidebar navigation items
    const navItems = ref([
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard'
      },
      {
        id: 'books',
        label: 'Libros',
        icon: 'pi pi-book',
        route: '/books-management'
      },
      {
        id: 'categories',
        label: 'Categorías',
        icon: 'pi pi-tags',
        route: '/categories'
      },
      {
        id: 'authors',
        label: 'Autores',
        icon: 'pi pi-user-edit',
        route: '/authors'
      },
      {
        id: 'orders',
        label: 'Pedidos',
        icon: 'pi pi-shopping-cart',
        route: '/orders'
      }
    ]);

    // Load user information
    const fetchUserInfo = async () => {
      try {
        const user = await getLoggedInUser();
        userInfo.value = user;
      } catch (error) {
        console.error("Error getting user info:", error);
      }
    };

    // Initialize user info
    fetchUserInfo();

    // Computed classes for the sidebar based on collapsed state
    const sidebarClasses = computed(() => {
      return {
        'sidebar-collapsed': props.collapsed
      };
    });

    // Navigate to the selected route
    const navigateTo = (item) => {
      activeItem.value = item.id;
      router.push(item.route);
    };

    // Toggle sidebar collapsed state
    const toggleSidebar = () => {
      emit('toggle-sidebar');
    };

    return {
      activeItem,
      navItems,
      userInfo,
      sidebarClasses,
      navigateTo,
      toggleSidebar,
      LanguageSwitcher
    };
  }
};
</script>

<template>
  <div class="sidebar-container" :class="sidebarClasses">
    <!-- Toggle Button -->
    <div class="sidebar-toggle" @click="toggleSidebar">
      <i :class="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
    </div>

    <!-- User Profile Section -->
    <div class="sidebar-user-profile">
      <div class="user-avatar">
        <span>{{ userInfo?.user?.charAt(0).toUpperCase() || 'U' }}</span>
      </div>
      <div class="user-info" v-if="!collapsed">
        <h3>{{ userInfo?.user || 'Usuario' }}</h3>
        <p>{{ userInfo?.role || 'Administrador' }}</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="sidebar-nav">
      <ul>
        <li
            v-for="item in navItems"
            :key="item.id"
            :class="{ active: activeItem === item.id }"
            @click="navigateTo(item)"
        >
          <i :class="item.icon"></i>
          <span v-if="!collapsed">{{ $t(`sidebar.${item.id}`) || item.label }}</span>
        </li>
      </ul>
    </div>

    <!-- Bottom Actions -->
    <div class="sidebar-actions">
      <div class="action-item" @click="navigateTo({id: 'settings', route: '/settings'})">
        <i class="pi pi-cog"></i>
        <span v-if="!collapsed">{{ $t('sidebar.settings') || 'Configuración' }}</span>
      </div>
      <div class="action-item" @click="navigateTo({id: 'logout', route: '/login'})">
        <i class="pi pi-sign-out"></i>
        <span v-if="!collapsed">{{ $t('sidebar.logout') || 'Cerrar Sesión' }}</span>
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
  background-color: var(--color-primary);
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

.sidebar-user-profile {
  display: flex;
  align-items: center;
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
}

.user-avatar {
  width: 40px;
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
  margin-left: 1rem;
}

.user-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
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

.sidebar-nav li:hover {
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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