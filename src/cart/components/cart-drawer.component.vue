<script>
import {CartApiService} from "../services/cart-api.service.js";

export default {
  name: "cartDrawer",
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
        console.error("Error al cargar el carrito:", error)
      }
    },
    getSubtotal() {
      return this.cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0)
    },
    async removeItem(bookId) {
      this.cartItems = this.cartItems.filter(item => item.book.id !== bookId)
    }
  },
  mounted() {
    this.loadCart()
  }
}
</script>

<template>

  <pv-drawer v-model:visible="visibleRight" header="Right Drawer" position="right">
    <div v-for="item in cartItems" :key="item.book.id" class="cart-item">
      <img :src="item.book.cover" alt="portada" width="60" />
      <div class="info">
        <strong>{{ item.book.title }}</strong><br />
        <span>{{ item.book.author }}</span><br />
        <span>S/ {{ item.book.price.toFixed(2) }}</span>
      </div>
      <div>
        <select v-model="item.quantity">
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
        <button @click="removeItem(item.book.id)">🗑️</button>
      </div>
    </div>

    <hr />
    <div class="footer">
      <p>Subtotal: <strong>S/ {{ getSubtotal().toFixed(2) }}</strong></p>
      <button>FINALIZAR MI COMPRA</button>
    </div>
  </pv-drawer>

</template>

<style scoped>

</style>