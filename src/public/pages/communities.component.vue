<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import communityGrid from "../../communities/components/Community-Grid.component.vue";

export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    communityGrid,
  }
}
</script>

<template>
  <!-- Header -->
  <toolbarComponent/>

  <div class="community-container">

    <div class="community__fullwidth">
      <!-- Title -->
      <div class="title__container">
        <h1 class="h1__title">{{$t('communities')}}</h1>
      </div>

      <!-- Communities Cards Section -->
      <div class="cards__container">
        <p class="h3__title">{{ $t('communities-intro')}}</p>
        <community-grid/>
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
}

.community__fullwidth,
.cards__container {
  padding: 0 2rem;
  margin-bottom: 4rem;
}

.cards__container p {
  margin: 0 0 4rem;
}

</style>