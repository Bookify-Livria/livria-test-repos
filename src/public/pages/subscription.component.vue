<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import subscription from "../../subscription/components/Community-Plan.component.vue";

export default {
  name: "subscription.component",
  components: {
    toolbarComponent,
    footerComponent,
    subscription
  }
}
</script>

<template>
  <toolbarComponent />

  <div class="subscription-container">
    <div class="subs__container">
      <subscription/>
    </div>

    <div class="footer__container-fullwidth">
      <footerComponent />
    </div>
  </div>



</template>

<style scoped>
.subscription-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;

}

.subs__container {
  margin-bottom: 4rem;
}
</style>
