<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Profile from "../../users/components/Profile.component.vue";

export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    Profile,
  }
}

</script>


<template>
  <!-- Header -->
  <toolbarComponent/>

  <div class="account-container">
    <div class="account__fullwidth">
      <!-- Title -->
      <div class="title__container">
        <h1 class="h1__title">{{$t('account')}}</h1>
      </div>

      <!-- Profile -->
        <div class="profile__container">
          <Profile/>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent/>
    </div>
  </div>

</template>

<style scoped>

.account-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.account__fullwidth {
  padding: 0 2rem;
  margin-bottom: 4rem;
}

</style>