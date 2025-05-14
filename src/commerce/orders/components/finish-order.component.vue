<script>
import { CartApiService } from "../../shared-services/cart-api.service.js";
import { OrderApiService } from "../services/order-api.service.js";
import { UserApiService } from "../../../subscription/service/user-api.service.js";
import { generateOrderCode } from "../services/order-code.generator.js";
import { getLoggedInUser } from "../../../public/shared-services/get-logged-user.js";
import { notifyEvent } from "../../../public/shared-services/to-notify.js";
import OrderConfirmation from "./order-confirmation.component.vue";

import trashIcon from "../../../assets/images/icons/Trash.svg";
import cartIcon from "../../../assets/images/icons/Shop_kart.svg";
import userIcon from "../../../assets/images/icons/User_alt.svg";
import packageIcon from "../../../assets/images/icons/Package.svg";
import cardIcon from "../../../assets/images/icons/Credit_card.svg";

export default {
  name: "finish-order.component" ,
  components: {
    trashIcon,
    cartIcon,
    userIcon,
    packageIcon,
    cardIcon,
    OrderConfirmation,
  },
  data() {
    return {
      code: "",
      cartItems: [],
      recipient: {
        name: "",
        lastname: "",
        phone: ""
      },
      userEmail: "",
      delivery: false,
      shipping: {
        address: "",
        city: "",
        region: "",
        reference: ""
      },
      acceptedTerms: false,
      acceptedPrivacy: false,

      showConfirmation: false,
    }
  },
  methods: {
    async loadCart() { // Obtiene la información almacenada dentro de carrito de compras
      try {
        const service = new CartApiService()
        this.cartItems = await service.getCart()
      } catch (error) {
        console.error("Error fetching cart:", error)
      }
    },
    getSubtotal() { // Calcula el subtotal en base a los elementos contenidos en el carrito de compras
      return this.cartItems.reduce((total, item) => (total + item.book.price * item.quantity * 0.82), 0)
    },
    getIGV() { // Calcula el IGV en base al precio de los elementos contenidos en el carrito de compras
      return this.cartItems.reduce((total, item) => (total + item.book.price * item.quantity * 0.18), 0)
    },
    getTotal() { // Calcula el precio total en base a los elementos contenidos en el carrito de compras
      return this.cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0)
    },
    async removeItem(Id) { // Elimina un producto de la lista de compras en base a su id
      try {
        const service = new CartApiService()
        await service.removeFromCart(Id)
        this.cartItems = await service.getCart()
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    },
    async createOrder(phone, delivery) { // Registra una nueva orden con los datos del usuario y de entrega, además genera un código de orden aleatorio
      try {
        const service = new OrderApiService();
        const orders = await service.getOrders();

        const newId = String(
            orders.length > 0
                ? Math.max(...orders.map(item => parseInt(item.id))) + 1
                : 1
        );
        this.code = generateOrderCode();

        const newOrder = {
          id: newId,
          code: this.code,
          items: this.cartItems,
          email: this.userEmail,
          phone,
          fullName: `${this.recipient.name} ${this.recipient.lastname}`,
          delivery,
          shipping: this.delivery === true || this.delivery === 'true' ? { ...this.shipping } : null,
          total: this.getTotal(),
          date: new Date().toISOString()
        };
        await service.createOrder(newOrder);

        const deleteService = new CartApiService();
        await deleteService.clearCart();

      } catch (error) {
        console.error("Error creating order:", error);
        this.showFail();
      }
    },
    async loadUserData() { // Carga la información del usuario loggeado y obtiene su parámetro "email"
      try {
        const user = await getLoggedInUser();
        if (user) {
          this.userEmail = user.email;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    showMissingFields() { // Muestra un mensaje flotante (Toast) que informa al usuario sobre un error de validación relacionado all llenado de campos del formulario
      this.$toast.add({
        severity: 'warn',
        summary: this.$t('purchase.notice'),
        detail: this.$t('purchase.field-missing'),
        life: 3000
      });
    },
    youveGotANoti() { // Muestra un mensaje flotante (Toast) que informa al usuario de que recibió una notificación
      this.$toast.add({
        severity: 'secondary',
        summary: this.$t('noti.notice'),
        detail: this.$t('noti.info'),
        life: 3000
      });
    },
    validateStep2() { // Verifica que todos los campos del formulario del paso 2 hayan sido llenados
      return this.recipient.name && this.recipient.lastname && this.recipient.phone;
    },
    validateStep3() { // Verifica que, de tratarse la orden de un delivery (entrega a domicilio), se registrem correctamente los campos "address", "district" y "reference"
      if (!this.delivery) return true;
      const { address, district, reference } = this.shipping;
      return address && district && reference;
    },
    validateStep4() { // Verifica que las checkboxes de "accept terms" y "accept privacy politics" estén activadas
      return this.acceptedTerms && this.acceptedPrivacy;
    },
    goToStep2(activateCallback) { // Valida que, pàra continuar desde el paso 2 de la compra, el cliente cuente con algún producto en su carrito de compras
      if (this.cartItems.length === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('purchase.notice'),
          detail: this.$t('purchase.cart-empty'),
          life: 3000
        });
      } else {
        activateCallback('2');
      }
    },
    goToStep3(activateCallback) { // Valida que, para continuar desde el paso 3 de la compra, el cliente haya completado el paso 2
      if (this.validateStep2()) {
        activateCallback('3');
      } else {
        this.showMissingFields();
      }
    },
    goToStep4(activateCallback) { // Valida que, para continuar desde el paso 4 de la compra, el cliente haya completado el paso 3
      if (this.validateStep3()) {
        activateCallback('4');
      } else {
        this.showMissingFields();
      }
    },
    async handleSubmit(activateCallback) { // Valida que se hayan completado todos los pasos correctamente para proceder con el registro de la orden
      if (!this.validateStep4()) {
        this.showMissingFields();
        return;
      }
      try {
        await this.createOrder(this.recipient.phone, this.delivery);

        const service = new UserApiService();
        const freshUser = await getLoggedInUser();
        this.user = freshUser;

        const newId = String(
            this.user.order.length > 0
                ? Math.max(...this.user.order.map(item => parseInt(item.id))) + 1
                : 1
        );

        const updatedOrders = (this.user.order || []).map(order => ({
          ...order,
          orderstatus: "delivered"
        }));

        const newOrder = {
          id: newId,
          code: this.code,
          orderstatus: "pending"
        };

        try {
          await service.updateUser({
            ...this.user,
            order: [...updatedOrders, newOrder]
          });
          this.showConfirmation = true;

        } catch (error) {
          console.error('Fail!!!!!!!', error);
        }

        this.showConfirmation = true;
        await notifyEvent("order");
        this.youveGotANoti();
      } catch (err) {
        console.error(err);
      }
    },
    goHome(){ // Permite al usuario volver a la ruta de "Home" dentro de la aplicación
      this.$router.push('/home');
    }
  },
  mounted() {
    this.loadCart();
    this.loadUserData();
  }
}
</script>

<template>

  <div class="purchase__container">
    <!-- Cart Summary -->
    <div class="purchase__left">
      <div class="purchase__left-cart">
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
      </div>

      <div class="purchase__left-footer">
        <p class="h3__title">Total</p>
        <p><strong>S/ {{ getTotal().toFixed(2) }}</strong></p>
      </div>
    </div>

    <!-- Payment Stepper -->
    <div class="purchase__right">
      <pv-stepper value="1" linear aria-label="Payment process">
        <pv-step-list>
          <pv-step v-slot="{ activateCallback, value }" asChild :value="1" aria-label="Step 1: Purchase summary">
            <div class="nav-title">
              <cartIcon class="nav-icon" />
              {{$t("purchase.step-summary")}}
            </div>
          </pv-step>
          <pv-step v-slot="{ activateCallback, value }" asChild :value="2" aria-label="Step 2: Recipient information">
            <div class="nav-title">
              <userIcon class="nav-icon" />
              {{$t("purchase.step-id")}}
            </div>
          </pv-step>
          <pv-step v-slot="{ activateCallback, value }" asChild :value="3" aria-label="Step 3: Delivery information">
            <div class="nav-title">
              <packageIcon class="nav-icon" />
              {{$t("purchase.step-delivery")}}
            </div>
          </pv-step>
          <pv-step v-slot="{ activateCallback, value }" asChild :value="4" aria-label="Step 4: Payment">
            <div class="nav-title">
              <cardIcon class="nav-icon" />
              {{$t("purchase.step-payment")}}
            </div>
          </pv-step>
        </pv-step-list>

        <pv-step-panels>
          <!-- Step 1: Summary-->
          <pv-step-panel v-slot="{ activateCallback }" value="1" aria-label="Step 1">
            <div class="step-content">
              <h3 class="h3__title go--orange">{{$t("purchase.summary")}}</h3>
              <div class="summary-row">
                <span>Subtotal</span>
                <span class="summary-amount">S/ {{ getSubtotal().toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>{{ $t("purchase.igv") }}</span>
                <span class="summary-amount">S/ {{ getIGV().toFixed(2) }}</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span class="total-amount">S/ {{ getTotal().toFixed(2) }}</span>
              </div>
              <div class="nav-buttons">
              <router-link to="/home"><button>{{ $t("purchase.cancel") }}</button></router-link>
              <button @click="goToStep2(activateCallback)">{{ $t("purchase.next") }}</button>
              </div>
            </div>
          </pv-step-panel>

          <!-- Step 2: Information -->
          <pv-step-panel v-slot="{ activateCallback }" value="2" aria-label="Step 2">
            <div class="step-content">
              <h3 class="h3__title go--orange">{{ $t("purchase.info-recipient") }}</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ $t("purchase.name")}}</label>
                  <input v-model="recipient.name" type="text"  required />
                </div>
                <div class="form-group">
                  <label>{{ $t("purchase.last-name")}}</label>
                  <input v-model="recipient.lastname" type="text" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ $t("purchase.email")}}</label>
                  <label>{{ userEmail }}</label>
                </div>
                <div class="form-group">
                  <label>{{ $t("purchase.phone")}}</label>
                  <input v-model="recipient.phone" type="tel" required />
                </div>
              </div>
              <pv-toast position="top-right" style="margin-top: 8.5rem" />
              <div class="nav-buttons">
                <button type="button" @click="activateCallback('1')">{{ $t("purchase.back") }}</button>
                <button type="button" @click="goToStep3(activateCallback)">
                  {{ $t("purchase.next") }}
                </button>
              </div>
            </div>
          </pv-step-panel>

          <!-- Step 3: Delivery -->
          <pv-step-panel v-slot="{ activateCallback }" value="3" aria-label="Step 3">
            <div class="step-content">
              <h3 class="h3__title go--orange">{{ $t("purchase.delivery") }}</h3>
              <div class="delivery-toggle nav-buttons">
                <button type="button" :class="{ active: !delivery }" @click="delivery = false">
                  {{ $t("purchase.pickup-store") }}
                </button>
                <button type="button" :class="{ active: delivery }" @click="delivery = true">
                  {{ $t("purchase.home-delivery") }}
                </button>
              </div>
              <div v-if="delivery" class="form-grid">
                <div class="form-row">
                  <div class="form-group">
                    <label>{{ $t("purchase.address")}}</label>
                    <input v-model="shipping.address" type="text"  required />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("purchase.district")}}</label>
                    <input v-model="shipping.district" type="text" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ $t("purchase.reference")}}</label>
                  <input v-model="shipping.reference" type="text" required />
                </div>
              </div>
              <div v-if="!delivery" class="form-grid">
                <p>{{ $t("purchase.pick-it-up")}}</p>
                <p>{{ $t("purchase.see-more")}}<router-link to="/shop">{{$t("purchase.here")}}</router-link></p>
              </div>
              <div class="nav-buttons">
                <pv-toast position="top-right" style="margin-top: 8.5rem" />
                <button @click="activateCallback('2')">{{ $t("purchase.back") }}</button>
                <button type="button" @click="goToStep4(activateCallback)">
                  {{ $t("purchase.next") }}
                </button>
              </div>
            </div>
          </pv-step-panel>

          <!-- Step 4: Payment -->
          <pv-step-panel v-slot="{ activateCallback }" value="4" aria-label="Step 4">
            <div class="step-content">
              <h3 class="h3__title go--orange">{{ $t("purchase.payment") }}</h3>
              <p>{{ $t("purchase.izipay")}}</p>
              <div class="izipay-box">
                <img
                    class="izipay-logo"
                    alt="izipay"
                    src="https://recurrentes.izipay.pe/pre-affiliation/static/media/Logo-izipay-v2.5fcb6d37210c5929c08e.png"
                />
              </div>
              <div class="checkbox-group">
                <label>
                  <input type="checkbox" v-model="acceptedTerms" aria-label="Accept terms and conditions"/>
                  {{ $t("purchase.terms") }}
                </label>
                <label>
                  <input type="checkbox" v-model="acceptedPrivacy" aria-label="Accept privacy policy"/>
                  {{ $t("purchase.privacy") }}
                </label>
              </div>
              <div class="nav-buttons">
                <pv-toast position="top-right" style="margin-top: 8.5rem" />
                <button type="button" @click="activateCallback('3')">{{$t("purchase.back")}}</button>
                <button type="button" @click="handleSubmit(activateCallback)" aria-label="Confirm payment and finish purchase">
                  {{ $t("purchase.pay") }}
                </button>
              </div>
            </div>
          </pv-step-panel>
        </pv-step-panels>
      </pv-stepper>
    </div>

  </div>
  <!-- Confirmation -->
  <OrderConfirmation v-if="showConfirmation" @close="goHome" :orderCode="code" ></OrderConfirmation>
</template>

<style scoped>

.purchase__container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.purchase__left {
  flex: 0 0 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
}

.purchase__right {
  flex: 0 0 70%;
}

.purchase__left-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  font-size: 1rem;
  border-top: 5px solid var(--color-secondary);
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
  text-align: left;
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

/* Stepper */

.nav-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-blue);
  transition: color 0.3s ease;
}

.nav-icon {
  stroke: currentColor;
  fill: none;
  overflow: visible;
  transition: fill 0.3s;
}

.step-content {
  padding: 2rem 10rem;
  background: var(--color-light);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
  height: 500px;
}

.summary-row,
.summary-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.summary-amount {
  font-weight: 600;
  color: var(--color-primary);
}

.summary-total span:first-child {
  color: var(--color-accent-orange);
  font-weight: 700;
  font-size: 1.1rem;
}

.total-amount {
  color: var(--color-accent-yellow);
  font-weight: bold;
  font-size: 1.2rem;
}

.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.form-group input {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: var(--color-background);
  font-size: 1rem;
  color: var(--color-text);
}

.form-group input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-secondary);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.delivery-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.delivery-toggle button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  color: var(--color-primary);
  background-color: #deeff3;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-toggle button.active {
  background-color: #b6cee2;
}

.izipay-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
}

.izipay-logo {
  height: 4rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
}


</style>