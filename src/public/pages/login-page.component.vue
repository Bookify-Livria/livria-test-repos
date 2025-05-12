<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Login from "../../users/components/Login.component.vue";

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
  <!-- Header -->
  <toolbarComponent/>

  <!-- Login form -->
  <div class="login__container">
    <Login/>
  </div>

</template>

<style scoped>
.login__container {
  margin-top: 200px;
}
</style>