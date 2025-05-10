<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import BookCard from "../../books/components/Book-Card.component.vue";

export default {
  name: "book-literature.component",
  components: {
    toolbarComponent,
    footerComponent,
    BookCard,
  },
  props: {
    genre: {
      type: String,
      required: true
    }
  },
  computed: {
    genreTitle() {
      const genreKeys = [
        "literatura",
        "ficcion",
        "noficcion",
        "mangasycomics",
        "juvenil",
        "infantil",
        "ebooks"
      ]
      return genreKeys.includes(this.genre)
          ? this.$t(`genres.${this.genre}`)
          : this.$t("genres.default")
    }
  }
}
</script>

<template>
  <toolbarComponent />

  <div class="literature-container">
    <div class="literature__fullwidth">
      <div class="title__container">
        <h1 class="h1__title">{{ genreTitle }}</h1>
      </div>

    </div>

    <div class="cards__container">
      <BookCard :genre="genre" />
    </div>

    <div class="footer__container-fullwidth">
      <footerComponent />
    </div>
  </div>
</template>
<style scoped>
.literature-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.literature__fullwidth {
  padding: 0 2rem;
  margin-bottom: 4rem;
}

</style>