<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import CommunityView from "../../communities/components/Community-View.component.vue";

export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    CommunityView,
  }
}
</script>

<template>
  <!-- Header -->
  <toolbarComponent/>

  <div class="community-container">

    <div class="community__fullwidth">
      <!-- Communities Cards Section -->
      <div class="cards__container">
        <CommunityView />
      </div>
    </div>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent/>
    </div>
  </div>
</template>

<style scoped>
.community-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
  margin-top: 200px;
}

.community__fullwidth,
.cards__container {
  padding: 0 2rem;
  margin-bottom: 4rem;
}

.cards__container p {
  margin: 0 0 3rem;
}

</style>