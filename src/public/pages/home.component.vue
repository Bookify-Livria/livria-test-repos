<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import bookCarousel from "../../books/components/books-carousel.component.vue";

export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    bookCarousel,
  }
}

</script>

<template>
  <!-- Header -->
  <toolbarComponent/>

  <div class="home-container">
    <!-- aca debería de ir el carrusel con los banners, todavía no está desarrollado -->
    <div class="mock-banner">
      <p>acá va el banner !!</p>
    </div>

    <!-- Scroll Section -->
    <section class="carousels__section">
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--orange">{{ $t('literature') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="literatura" />
        </div>
      </div>
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--yellow">{{ $t('non-fiction') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="noficcion" />
        </div>
      </div>
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--blue">{{ $t('fiction') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="ficcion" />
        </div>
      </div>
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--orange">{{ $t('mangas and comics') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="mangasycomics" />
        </div>
      </div>
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--yellow">{{ $t('juvenile') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="juvenil" />
        </div>
      </div>
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--blue">{{ $t('children') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="infantil" />
        </div>
      </div>
      <div class="carousels__section-container">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link go--orange">{{ $t('ebooks and audiobooks') }}</router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel genre="ebooks" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent/>
    </div>
  </div>


</template>

<style scoped>

.home-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}
/* Banner */
.mock-banner { /* pasará a ser el div que contenga ese carrusel en su componente*/
  width: 100vw;
  height: 300px;
  padding: 0;
  margin: 0;
  border: 1px solid red;
}

/* Categories Carousels */
.carousels__section {
  padding: 1rem;
}

.carousels__section-container {
  width: 100%;
  padding: 0 2rem;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.carousels__section-title {
  margin: 0 1rem 1rem;
}

.carousels__section-link {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 3px;
  text-decoration: none;
  font-size: 32px;
  font-weight: 600;
}

.carousel__section-fullwidth,
.footer__container-fullwidth  {
  width: 100vw;
  margin-left: calc(-1 * ((100vw - 100%) / 2));
}

</style>