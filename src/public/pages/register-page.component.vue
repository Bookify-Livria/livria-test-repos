<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Register from "../../subscription/components/Register.component.vue";

export default {
  name: "register-page",
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

  <!-- Register form -->
  <div class="register__container">
    <Register/>
  </div>

</template>

<style scoped>
.register__container {
  margin-top: 200px;
}
</style>