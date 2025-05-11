<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Register from "../../users/components/Register.component.vue";

export default {
  name: "login-page.component",
  components: {
    toolbarComponent,
    footerComponent,
    Register,
  }
}

</script>


<template>
  <!-- Header -->
  <toolbarComponent/>

  <!-- Title -->
  <div class="title__container">
    <h1 class="h1__title">{{$t('account')}}</h1>
  </div>


  <!-- Register form -->
  <div class="register__container">
    <Register/>
  </div>

  <!-- Footer -->
  <div class="footer__container-fullwidth">
    <footerComponent/>
  </div>

</template>

<style scoped>

</style>