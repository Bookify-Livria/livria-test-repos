<script>
import AdminAccessComponent from "../../subscription/components/Admin-Access.component.vue";

export default {
  name: "admin-pin-page.component" ,
  components: {
    AdminAccessComponent
  }
}
</script>

<template>

  <!-- Security-Pin form -->
  <div class="login__container">
    <AdminAccessComponent/>
  </div>

</template>

<style scoped>
.login__container {
  margin: 5rem calc(-1 * ((100vw - 100%) / 2));
  width: 100vw;
  padding: 0 3rem;
}
</style>