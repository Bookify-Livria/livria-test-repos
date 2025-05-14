<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Login from "../../subscription/components/Login.component.vue";

export default {
  name: "login-page",
  components: {
    toolbarComponent,
    footerComponent,
    Login,
  }
}
</script>

<template>

  <!-- Login form -->
  <div class="login__container">
    <Login/>
  </div>

</template>

<style scoped>
.login__container {
  margin: 5rem calc(-1 * ((100vw - 100%) / 2));
  width: 100vw;
  padding: 0 3rem;
}
</style>