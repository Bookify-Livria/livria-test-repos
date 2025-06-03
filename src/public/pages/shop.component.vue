<script>
import {defineComponent} from "vue";
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";

export default defineComponent({
  name: "shop.component",
  components: {
    footerComponent,
    toolbarComponent
  }
})
</script>

<template>
  <toolbarComponent/>
  <div class="shop-container">
    <div class="shop-left">
      <h2>{{$t("livriaStore")}}</h2>
      <img src="../../assets/images/store/shopLivria.png" alt="Store_img" class="shop-photo" />
    </div>
    <div class="shop-right">
      <h3 class="h3__title">{{$t("address")}}</h3>
      <p>Av. República de Chile 661, Jesús María 15072, Peru</p>
      <iframe
          class="shop-map"
          src="https://www.google.com/maps?q==Av.+República+de+Chile+661,+Jesús+María+15072&output=embed"
          width="300"
          height="200"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
      ></iframe>
    </div>
  </div>
  <div class="footer__container-fullwidth">
    <footerComponent/>
  </div>
</template>

<style scoped>
.shop-container {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 17rem 3rem 9.5rem;
  flex-wrap: wrap;
}

.shop-left, .shop-right {
  flex: 1 1 350px;
  min-width: 280px;
  max-width: 600px;
  box-sizing: border-box;
}

.shop-left {
  text-align: center;
  background-color: #213547;
  border-radius: 8px;
  color: #eefafa;
  padding: 1rem 1.5rem 2.5rem;
  margin-bottom: 2rem;
  width: 100%;
}

.shop-photo {
  width: 100%;
  max-width: 380px;
  height: auto;
  border-radius: 8px;
}

.shop-right {
  text-align: center;
  border-radius: 8px;
  padding: 2rem 1.5rem 0;
  margin-bottom: 2rem;
  color: #feb913;
  font-size: 1rem;
}

.shop-right p{
  text-align: center;
}

.shop-map {
  margin-top: 1rem;
  width: 100%;
  max-width: 450px;
  height: 205px;
  border-radius: 8px;
}

/* Media queries para pantallas pequeñas */
@media (max-width: 900px) {
  .shop-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    padding: 18rem 0.5rem 2rem;
  }
  .shop-left, .shop-right {
    max-width: 100%;
    min-width: 0;
    padding: 1rem 4rem 3rem;
  }
  .shop-photo, .shop-map {
    max-width: 100%;
  }
}

.footer__container-fullwidth {
  width: 100vw;
  margin-left: calc(-1 * ((100vw - 100%) / 2));
}
</style>