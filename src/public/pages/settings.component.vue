<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dashboardSidebar from "../../manager/components/dashboard-sidebar.component.vue"
import LanguageSwitcher from "../../public/components/language-switcher.component.vue"
import { getLoggedInUser } from "../../public/shared-services/get-logged-user.js"

export default {
  name: "SettingsComponent",
  components: {
    dashboardSidebar,
    LanguageSwitcher
  },
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const sidebarCollapsed = ref(false);
    const activeTab = ref('profile');
    const saveStatus = ref('');
    const showChangePassword = ref(false);

    // User information
    const userInfo = ref(null);

    // Form data
    const userProfile = reactive({
      name: '',
      email: '',
      role: '',
      language: 'es',
      avatar: ''
    });

    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    // App settings
    const appSettings = reactive({
      notifications: true,
      emailAlerts: true,
      darkMode: false,
      autoSave: true,
      pageSize: 10
    });

    // System settings
    const systemSettings = reactive({
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      sessionTimeout: 30
    });

    // Form validation
    const profileErrors = ref({});
    const passwordErrors = ref({});
    const systemErrors = ref({});

    // Fetch user information
    const fetchUserInfo = async () => {
      try {
        loading.value = true;
        const user = await getLoggedInUser();
        userInfo.value = user;

        // Initialize form with user data
        userProfile.name = user.user || '';
        userProfile.email = user.email || 'admin@example.com';
        userProfile.role = user.role || 'Administrator';
        userProfile.language = user.language || 'es';
      } catch (error) {
        console.error("Error getting user info:", error);
      } finally {
        loading.value = false;
      }
    };

    // Toggle sidebar
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    // Switch between tabs
    const switchTab = (tab) => {
      activeTab.value = tab;
      saveStatus.value = '';
    };

    // Validate profile form
    const validateProfileForm = () => {
      const errors = {};

      if (!userProfile.name.trim()) {
        errors.name = 'El nombre es obligatorio';
      }

      if (!userProfile.email.trim()) {
        errors.email = 'El correo electrónico es obligatorio';
      } else if (!/^\S+@\S+\.\S+$/.test(userProfile.email)) {
        errors.email = 'El correo electrónico no es válido';
      }

      profileErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    // Validate password form
    const validatePasswordForm = () => {
      const errors = {};

      if (!passwordForm.currentPassword) {
        errors.currentPassword = 'La contraseña actual es obligatoria';
      }

      if (!passwordForm.newPassword) {
        errors.newPassword = 'La nueva contraseña es obligatoria';
      } else if (passwordForm.newPassword.length < 8) {
        errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }

      passwordErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    // Save profile changes
    const saveProfile = async () => {
      if (!validateProfileForm()) return;

      try {
        loading.value = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update user info
        userInfo.value = {
          ...userInfo.value,
          user: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
          language: userProfile.language
        };

        saveStatus.value = 'success';
        setTimeout(() => {
          saveStatus.value = '';
        }, 3000);
      } catch (error) {
        console.error("Error saving profile:", error);
        saveStatus.value = 'error';
      } finally {
        loading.value = false;
      }
    };

    // Change password
    const changePassword = async () => {
      if (!validatePasswordForm()) return;

      try {
        loading.value = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        saveStatus.value = 'success';
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
        showChangePassword.value = false;

        setTimeout(() => {
          saveStatus.value = '';
        }, 3000);
      } catch (error) {
        console.error("Error changing password:", error);
        saveStatus.value = 'error';
      } finally {
        loading.value = false;
      }
    };

    // Save app settings
    const saveAppSettings = async () => {
      try {
        loading.value = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        saveStatus.value = 'success';
        setTimeout(() => {
          saveStatus.value = '';
        }, 3000);
      } catch (error) {
        console.error("Error saving app settings:", error);
        saveStatus.value = 'error';
      } finally {
        loading.value = false;
      }
    };

    // Save system settings
    const saveSystemSettings = async () => {
      try {
        loading.value = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        saveStatus.value = 'success';
        setTimeout(() => {
          saveStatus.value = '';
        }, 3000);
      } catch (error) {
        console.error("Error saving system settings:", error);
        saveStatus.value = 'error';
      } finally {
        loading.value = false;
      }
    };

    // Initialize component
    onMounted(() => {
      fetchUserInfo();
    });

    return {
      loading,
      sidebarCollapsed,
      activeTab,
      saveStatus,
      showChangePassword,
      userInfo,
      userProfile,
      passwordForm,
      appSettings,
      systemSettings,
      profileErrors,
      passwordErrors,
      systemErrors,
      toggleSidebar,
      switchTab,
      saveProfile,
      changePassword,
      saveAppSettings,
      saveSystemSettings
    };
  }
};
</script>

<template>
  <div class="settings-page" :class="{ 'sidebar-expanded': !sidebarCollapsed }">
    <dashboardSidebar
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
    />

    <div class="main-content">
      <div v-if="loading && !userInfo" class="loading-container">
        <p>{{ $t('dashboard-settings.loading') }}</p>
      </div>

      <div v-else class="settings-container">
        <div class="settings-header">
          <h1>{{ $t('dashboard-settings.title') }}</h1>
          <p>{{ $t('dashboard-settings.subtitle') }}</p>
        </div>

        <div class="settings-content">
          <!-- Settings Tabs -->
          <div class="settings-tabs">
            <div
                class="tab-item"
                :class="{ active: activeTab === 'profile' }"
                @click="switchTab('profile')"
            >
              <i class="pi pi-user"></i>
              <span>{{ $t('dashboard-settings.profile') }}</span>
            </div>
            <div
                class="tab-item"
                :class="{ active: activeTab === 'app' }"
                @click="switchTab('app')"
            >
              <i class="pi pi-desktop"></i>
              <span>{{ $t('dashboard-settings.app') }}</span>
            </div>
            <div
                class="tab-item"
                :class="{ active: activeTab === 'system' }"
                @click="switchTab('system')"
                v-if="userInfo?.role === 'Administrator'"
            >
              <i class="pi pi-cog"></i>
              <span>{{ $t('dashboard-settings.system') }}</span>
            </div>
          </div>

          <!-- Settings Forms -->
          <div class="settings-forms">
            <!-- Success/Error Messages -->
            <div v-if="saveStatus" class="status-message" :class="saveStatus">
              <i :class="saveStatus === 'success' ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
              <span v-if="saveStatus === 'success'">{{ $t('dashboard-settings.save-success') }}</span>
              <span v-else>{{ $t('dashboard-settings.save-error') }}</span>
            </div>

            <!-- Profile Settings -->
            <div v-if="activeTab === 'profile'" class="form-section">
              <h2>{{ $t('dashboard-settings.profile-info') }}</h2>

              <div class="profile-header">
                <div class="profile-avatar">
                  <span>{{ userProfile.name?.charAt(0).toUpperCase() || 'U' }}</span>
                </div>
                <div class="profile-info">
                  <h3>{{ userProfile.name || $t('dashboard-settings.user') }}</h3>
                  <p>{{ userProfile.role || $t('dashboard-settings.admin') }}</p>
                </div>
              </div>

              <div class="form-group">
                <label for="name">{{ $t('dashboard-settings.name') }}:</label>
                <input
                    type="text"
                    id="name"
                    v-model="userProfile.name"
                    class="form-control"
                    :class="{ 'error': profileErrors.name }"
                />
                <span class="error-message" v-if="profileErrors.name">{{ profileErrors.name }}</span>
              </div>

              <div class="form-group">
                <label for="email">{{ $t('dashboard-settings.email') }}:</label>
                <input
                    type="email"
                    id="email"
                    v-model="userProfile.email"
                    class="form-control"
                    :class="{ 'error': profileErrors.email }"
                />
                <span class="error-message" v-if="profileErrors.email">{{ profileErrors.email }}</span>
              </div>

              <div class="form-group">
                <label for="role">{{ $t('dashboard-settings.role') }}:</label>
                <input
                    type="text"
                    id="role"
                    v-model="userProfile.role"
                    class="form-control"
                    disabled
                />
              </div>

              <div class="form-group">
                <label>{{ $t('dashboard-settings.language') }}:</label>
                <LanguageSwitcher v-model="userProfile.language" />
              </div>

              <div class="form-actions">
                <button class="btn-password" @click="showChangePassword = !showChangePassword">
                  {{ $t('dashboard-settings.change-password') }}
                </button>
                <button class="btn-save" @click="saveProfile" :disabled="loading">
                  <i class="pi pi-save" v-if="!loading"></i>
                  <i class="pi pi-spin pi-spinner" v-else></i>
                  {{ $t('dashboard-settings.save') }}
                </button>
              </div>

              <!-- Change Password Form -->
              <div v-if="showChangePassword" class="password-form">
                <h3>{{ $t('dashboard-settings.change-password') }}</h3>

                <div class="form-group">
                  <label for="current-password">{{ $t('dashboard-settings.current-password') }}:</label>
                  <input
                      type="password"
                      id="current-password"
                      v-model="passwordForm.currentPassword"
                      class="form-control"
                      :class="{ 'error': passwordErrors.currentPassword }"
                  />
                  <span class="error-message" v-if="passwordErrors.currentPassword">{{ passwordErrors.currentPassword }}</span>
                </div>

                <div class="form-group">
                  <label for="new-password">{{ $t('dashboard-settings.new-password') }}:</label>
                  <input
                      type="password"
                      id="new-password"
                      v-model="passwordForm.newPassword"
                      class="form-control"
                      :class="{ 'error': passwordErrors.newPassword }"
                  />
                  <span class="error-message" v-if="passwordErrors.newPassword">{{ passwordErrors.newPassword }}</span>
                </div>

                <div class="form-group">
                  <label for="confirm-password">{{ $t('dashboard-settings.confirm-password') }}:</label>
                  <input
                      type="password"
                      id="confirm-password"
                      v-model="passwordForm.confirmPassword"
                      class="form-control"
                      :class="{ 'error': passwordErrors.confirmPassword }"
                  />
                  <span class="error-message" v-if="passwordErrors.confirmPassword">{{ passwordErrors.confirmPassword }}</span>
                </div>

                <div class="form-actions">
                  <button class="btn-cancel" @click="showChangePassword = false">
                    {{ $t('dashboard-settings.cancel') }}
                  </button>
                  <button class="btn-save" @click="changePassword" :disabled="loading">
                    <i class="pi pi-check" v-if="!loading"></i>
                    <i class="pi pi-spin pi-spinner" v-else></i>
                    {{ $t('dashboard-settings.update-password') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- App Settings -->
            <div v-if="activeTab === 'app'" class="form-section">
              <h2>{{ $t('dashboard-settings.app-settings') }}</h2>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.notifications') }}</h3>
                  <p>{{ $t('dashboard-settings.notifications-desc') }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="notifications" v-model="appSettings.notifications" />
                    <label for="notifications"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.email-alerts') }}</h3>
                  <p>{{ $t('dashboard-settings.email-alerts-desc') }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="email-alerts" v-model="appSettings.emailAlerts" />
                    <label for="email-alerts"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.dark-mode') }}</h3>
                  <p>{{ $t('dashboard-settings.dark-mode-desc') }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="dark-mode" v-model="appSettings.darkMode" />
                    <label for="dark-mode"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.auto-save') }}</h3>
                  <p>{{ $t('dashboard-settings.auto-save-desc') }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="auto-save" v-model="appSettings.autoSave" />
                    <label for="auto-save"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.page-size') }}</h3>
                  <p>{{ $t('dashboard-settings.page-size-desc') }}</p>
                </div>
                <div class="setting-control">
                  <select v-model="appSettings.pageSize" class="form-control">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn-save" @click="saveAppSettings" :disabled="loading">
                  <i class="pi pi-save" v-if="!loading"></i>
                  <i class="pi pi-spin pi-spinner" v-else></i>
                  {{ $t('dashboard-settings.save') || 'Guardar cambios' }}
                </button>
              </div>
            </div>

            <!-- System Settings -->
            <div v-if="activeTab === 'system'" class="form-section">
              <h2>{{ $t('dashboard-settings.system-settings') }}</h2>

              <div class="admin-warning">
                <i class="pi pi-exclamation-triangle"></i>
                <span>{{ $t('dashboard-settings.admin-warning') }}</span>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.maintenance-mode') }}</h3>
                  <p>{{ $t('dashboard-settings.maintenance-mode-desc')  }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="maintenance-mode" v-model="systemSettings.maintenanceMode" />
                    <label for="maintenance-mode"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.debug-mode')  }}</h3>
                  <p>{{ $t('dashboard-settings.debug-mode-desc') }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="debug-mode" v-model="systemSettings.debugMode" />
                    <label for="debug-mode"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.cache-enabled') }}</h3>
                  <p>{{ $t('dashboard-settings.cache-enabled-desc') }}</p>
                </div>
                <div class="setting-control">
                  <div class="toggle-switch">
                    <input type="checkbox" id="cache-enabled" v-model="systemSettings.cacheEnabled" />
                    <label for="cache-enabled"></label>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>{{ $t('dashboard-settings.session-timeout') }}</h3>
                  <p>{{ $t('dashboard-settings.session-timeout-desc') }}</p>
                </div>
                <div class="setting-control">
                  <input
                      type="number"
                      min="1"
                      max="240"
                      v-model.number="systemSettings.sessionTimeout"
                      class="form-control narrow"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button class="btn-save" @click="saveSystemSettings" :disabled="loading">
                  <i class="pi pi-save" v-if="!loading"></i>
                  <i class="pi pi-spin pi-spinner" v-else></i>
                  {{ $t('dashboard-settings.save') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.settings-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 2.2rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.settings-header p {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.settings-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.settings-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-item {
  padding: 1.2rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.tab-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.tab-item.active {
  color: var(--color-primary);
  font-weight: 600;
  border-bottom: 3px solid var(--color-accent-orange);
  margin-bottom: -1px;
}

.tab-item i {
  margin-right: 0.8rem;
  font-size: 1.1rem;
}

.settings-forms {
  padding: 2rem;
}

.status-message {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-message.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-message.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.status-message i {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-radius: 10px;
}

.profile-avatar {
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

.profile-info h3 {
  font-size: 1.4rem;
  color: var(--color-primary);
  margin-bottom: 0.3rem;
}

.profile-info p {
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}

.form-control.error {
  border-color: #F44336;
}

.form-control.narrow {
  max-width: 100px;
}

.form-control:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #F44336;
  font-size: 0.85rem;
  margin-top: 0.4rem;
  display: block;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-save, .btn-password, .btn-cancel {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-save {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

.btn-save:hover:not(:disabled) {
  background-color: #005a87;
}

.btn-save i {
  margin-right: 0.5rem;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-password {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-password:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
}

.btn-cancel {
  background-color: #f5f5f5;
  color: var(--color-text);
  border: none;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}
</style>