<script>
import { ref } from 'vue'
import Button from 'primevue/button'

import toolbarComponent from "../components/toolbar.component.vue"
import footerComponent from "../components/footer-content.component.vue"
import bookCarousel from "../../commerce/books/components/books-carousel.component.vue"

export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    bookCarousel,
    Button
  },
  setup() {
    const slides = ref([
      {
        tituloKey: 'carousel.community.title',
        descripcionKey: 'carousel.community.description',
        imagen: 'https://i.imgur.com/lKkTuRQ.jpg'
      },
      {
        tituloKey: 'carousel.worlds.title',
        descripcionKey: 'carousel.worlds.description',
        imagen: 'https://i.imgur.com/yXEnAAL.jpg'
      },
      {
        tituloKey: 'carousel.passion.title',
        descripcionKey: 'carousel.passion.description',
        imagen: 'https://i.imgur.com/CTvddky.jpg'
      }
    ])

    const genres = ref([
      { id: 'literatura', label: 'literature', colorClass: 'go--orange' },
      { id: 'noficcion', label: 'non-fiction', colorClass: 'go--yellow' },
      { id: 'ficcion', label: 'fiction', colorClass: 'go--blue' },
      { id: 'mangasycomics', label: 'mangas and comics', colorClass: 'go--orange' },
      { id: 'juvenil', label: 'juvenile', colorClass: 'go--yellow' },
      { id: 'infantil', label: 'children', colorClass: 'go--blue' },
      { id: 'ebooks', label: 'ebooks and audiobooks', colorClass: 'go--orange' },
    ])

    return { slides, genres }
  }
}
</script>

<template>
  <toolbarComponent />

  <div class="home-container">
    <pv-carousel :value="slides" :numVisible="1" :numScroll="1" circular :autoplayInterval="5000">
      <template #item="slotProps">
        <div
            class="carousel-slide"
            :style="{ backgroundImage: `url(${slotProps.data.imagen})` }"
        >
          <div class="carousel-overlay">
            <h1 class="carousel-title">
              {{ $t(slotProps.data.tituloKey) }}
            </h1>
            <p class="carousel-description">
              {{ $t(slotProps.data.descripcionKey) }}
            </p>
            <pv-button :label="$t('carousel.button')" class="carousel-button" />
          </div>
        </div>
      </template>
    </pv-carousel>

    <section class="carousels__section">
      <div class="carousels__section-container" v-for="genre in genres" :key="genre.id">
        <div class="carousels__section-title">
          <router-link to="" class="carousels__section-link" :class="genre.colorClass">
            {{ $t(genre.label) }}
          </router-link>
        </div>
        <div class="carousel__section-fullwidth">
          <bookCarousel :genre="genre.id" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  margin: 7.5rem calc(-1 * ((95vw - 100%) / 2));
}

.p-carousel {
  width: 100%;
}

.carousel-slide {
  width: 100%;
  height: 600px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.carousel-title {
  font-size: 3rem;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 1rem;
}

.carousel-description {
  font-size: 1.25rem;
  color: #ffffff;
  max-width: 800px;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.carousel-button {
  background-color: #ffffff !important;
  color: #1a237e !important;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 8px;
}

/* === Sección de géneros === */
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

.go--orange {
  color: #ff9800;
}

.go--yellow {
  color: #ffeb3b;
}

.go--blue {
  color: #2196f3;
}

.carousel__section-fullwidth,
.footer__container-fullwidth {
  width: 100vw;
  margin-left: calc(-1 * ((100vw - 100%) / 2));
}
</style>
