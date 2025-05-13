<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import finishOrder from "../../commerce/orders/components/finish-order.component.vue"

export default {
  name: "purchase.component" ,
  components: {
    toolbarComponent,
    footerComponent,
    finishOrder
  }
}
</script>

<template>
  <!-- Header -->
  <toolbarComponent />

  <div class="purchase-container">

    <div class="purchase__fullwidth">
      <!-- Title -->
      <div class="title__container">
        <h1 class="h1__title">{{$t('finish-purchase')}}</h1>
      </div>

      <!-- Cart Summary and Stepper -->
      <div class="purchase__info">
        <finishOrder />
      </div>
    </div>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent/>
    </div>
  </div>

</template>

<style scoped>
.purchase-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.purchase__fullwidth {
  padding: 0 2rem;
  margin-bottom: 4rem;
}
</style>