<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Login from "../../subscription/components/Login.component.vue";

export default {
  name: "login-page.component",
  components: {
    toolbarComponent,
    footerComponent,
    Login,
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


  <!-- Login form -->
  <div class="login__container">
    <Login/>
  </div>

  <!-- Footer -->
  <div class="footer__container-fullwidth">
    <footerComponent/>
  </div>

</template>

<style scoped>

</style>