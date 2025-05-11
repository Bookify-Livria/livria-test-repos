<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import recommendedBooks from "../../books/components/recommended-books.component.vue";

export default {
  name: "recomendation.component",
  components: {
    toolbarComponent,
    footerComponent,
    recommendedBooks
  }
};
</script>

<template>
  <toolbarComponent />
  <div class="book-container">
    <div class="book__fullwidth">
      <div class="cards__container">
        <recommendedBooks />
      </div>
    </div>

    <div class="footer__container-fullwidth">
      <footerComponent />
    </div>
  </div>

</template>

<style scoped>
.footer__container-fullwidth {
  margin-top: 2rem;
}

.book-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.book__fullwidth,
.cards__container {
  padding: 0 2rem;
  margin-bottom: 4rem;
}

.cards__container p {
  margin: 0 0 3rem;
}

</style>
