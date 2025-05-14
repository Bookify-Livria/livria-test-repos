<script>
import trashIcon from "../../assets/images/icons/Trash.svg";
import {NotificationApiService} from "../services/notification-api.service.js";

export default {
  name: "notifications-drawer.component-api",
  components: {
    trashIcon,
  },
  data() {
    return {
      visibleRight: false,
      notisItems: []
    }
  },
  methods: {
    toggleDrawer() { // Alterna la visibilidad del drawer de notificaciones
      this.visibleRight = !this.visibleRight
      if (this.visibleRight) this.loadCart()
    },
    closeDrawer() { // Oculta el drawer de notificaciones
      this.visibleRight = false
    },
    async loadNotis() {  // Permite cargar la información relacionada a notificaciones dentro de la Fake API
      try {
        const service = new NotificationApiService();
        this.notisItems = await service.getNotifications();
      } catch (error) {
        console.error("Error fetching cart:", error)
      }
    },
    async removeItem(id) { // Permite eliminar una notificación de la bandeja de notificaciones según su id
      try {
        const service = new NotificationApiService();
        await service.removeFromList(id)
        this.notisItems = await service.getNotifications();
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    },
    async emptyList() { // Permite eliminar todos los elementos almacenados dentro de la bandjea de notificaciones
      try {
        const service = new NotificationApiService();
        await service.clearList()
        this.notisItems = [];
      } catch (error) {
        console.error("Error deleting list:", error)
      }
    }
  },
  watch: {
    visibleRight(val) {
      this.$emit('visibility-change', val)
    }
  },
  mounted() {
    this.loadNotis()
  }
}
</script>

<template>

  <div class="notis-list__container" aria-label="Notification list">
    <!-- Overlay  -->
    <div
        v-if="visibleRight"
        class="custom-overlay"
        @click="closeDrawer"
    ></div>
    <!-- Drawer -->
    <pv-drawer v-model:visible="visibleRight" position="right" style="width: 600px">
      <template #header>
        <div class="title__container">
          <h1 class="h1__title go--yellow">{{$t('notifications')}}</h1>
        </div>
      </template>

      <button @click="emptyList" aria-label="Empty notification list">{{$t('empty-list')}}</button>
      <div v-for="noti in notisItems" :key="noti.id" class="notis-list__noti">
        <div class="notis-list__noti-info">
          <strong>{{ noti.title }}</strong><br />
          <span>{{ noti.content }}</span><br />
        </div>
        <div class="notis-list__actions">
          <button @click="removeItem(noti.id)"><trashIcon /></button>
        </div>
      </div>
    </pv-drawer>
  </div>

</template>

<style scoped>

:deep(.custom-overlay) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 999;
}

.notis-list__noti {
  display: flex;
  align-notis: center;
  background-color: var(--color-light);
  color: var(--color-text);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  gap: 1rem;
}

.notis-list__noti img {
  border-radius: 5px;
}

.notis-list__noti-info {
  flex: 1;
  font-size: 0.9rem;
}

.notis-list__actions {
  display: flex;
  align-items: center;
}

.notis-list__actions select {
  padding: 0.3rem;
  border-radius: 5px;
  margin-right: 0.5rem;
}

.notis-list__actions button {
  background: none;
  border: none;
  cursor: pointer;
  stroke: currentColor;
  fill: none;
  overflow: visible;
  transition: fill 0.3s;
}

.notis-list__actions button:hover {
  color: var(--color-accent-orange);
}

.notis-list__footer p {
  margin: 0;
  color: var(--color-accent-light-yellow);
  font-weight: 400;
}

</style>