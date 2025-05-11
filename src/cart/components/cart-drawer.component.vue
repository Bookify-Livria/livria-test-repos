<script>
import {CartApiService} from "../services/cart-api.service.js";
import trashIcon from "../../assets/images/icons/Trash.svg";

export default {
  name: "cartDrawer",
  components: {
    trashIcon,
  },
  data() {
    return {
      visibleRight: false,
      cartItems: []
    }
  },
  methods: {
    toggleDrawer() {
      this.visibleRight = !this.visibleRight
      if (this.visibleRight) this.loadCart()
    },
    openDrawer() {
      this.visibleRight = true
      this.loadCart()
    },
    closeDrawer() {
      this.visibleRight = false
    },
    async loadCart() {
      try {
        const service = new CartApiService()
        this.cartItems = await service.getCart()
      } catch (error) {
        console.error("Error fetching cart:", error)
      }
    },
    getSubtotal() {
      return this.cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0)
    },
    async removeItem(Id) {
      try {
        const service = new CartApiService()
        await service.removeFromCart(Id)
        this.cartItems = await service.getCart()
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    },
    async emptyCart(){
      try {
        const service = new CartApiService();
        await service.clearCart();
        this.cartItems = [];
      } catch (error) {
        console.error("Error clearing shopping cart:", error);
      }
    }
  },
  watch: {
    visibleRight(val) {
      this.$emit('visibility-change', val)
    }
  },
  mounted() {
    this.loadCart()
  }
}
</script>

<template>

  <div class="shopping-cart__container">
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
          <h1 class="h1__title go--yellow">{{$t('cart')}}</h1>
        </div>
      </template>

      <button @click="emptyCart">{{$t('empty-cart')}}</button>
      <div v-for="item in cartItems" :key="item.book.id" class="shopping-cart__cart-item">
        <img :src="item.book.cover" alt="portada" width="60" />
        <div class="shopping-cart__item-info">
          <strong>{{ item.book.title }}</strong><br />
          <span>{{ item.book.author }}</span><br />
          <span>S/ {{ item.book.price.toFixed(2) }}</span>
        </div>
        <div class="shopping-cart__actions">
          <select v-model="item.quantity">
            <option v-for="n in 3" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="removeItem(item.id)"><trashIcon /></button>
        </div>
      </div>

      <template #footer>
        <div class="shopping-cart__footer">
          <p>Subtotal: <strong>S/ {{ getSubtotal().toFixed(2) }}</strong></p>
          <!-- falta que lleve a las pantallas de finalizar compra -->
          <button>{{$t('buy-cart')}}</button>
        </div>
      </template>
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

.shopping-cart__cart-item {
  display: flex;
  align-items: center;
  background-color: var(--color-light);
  color: var(--color-text);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  gap: 1rem;
}

.shopping-cart__cart-item img {
  border-radius: 5px;
}

.shopping-cart__item-info {
  flex: 1;
  font-size: 0.9rem;
}

.shopping-cart__actions {
  display: flex;
  align-items: center;
}

.shopping-cart__actions select {
  padding: 0.3rem;
  border-radius: 5px;
  margin-right: 0.5rem;
}

.shopping-cart__actions button {
  background: none;
  border: none;
  cursor: pointer;
  stroke: currentColor;
  fill: none;
  overflow: visible;
  transition: fill 0.3s;
}

.shopping-cart__actions button:hover {
  color: var(--color-accent-orange);
}

.shopping-cart__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-light);
  padding-top: 1rem;
  margin-top: 2rem;
}

.shopping-cart__footer p {
  margin: 0;
  color: var(--color-accent-light-yellow);
  font-weight: bold;
}

</style>