<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import communityGrid from "../../communities/components/Community-Grid.component.vue";
import bookCarousel from "../../commerce/books/components/books-carousel.component.vue";

export default {
  name: "home.component",
  components: {
    bookCarousel,
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
        <p>{{ $t('communities-intro')}}</p>
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