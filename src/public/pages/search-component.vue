<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import BookSearch from "../../books/components/book-search.component.vue";
import BookDetail from "../../books/components/book-detail.component.vue";

export default {
  name: "search-component",
  components: {
    BookDetail,
    toolbarComponent,
    footerComponent,
    BookSearch,
  }
};
</script>

<template>
  <toolbarComponent />

  <div class="search-container">
      <div class="booksearch__container">
        <BookSearch />
    </div>

    <div class="footer__container-fullwidth">
      <footerComponent />
    </div>
  </div>



</template>



<style scoped>
.search-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.booksearch__container {
  margin-bottom: 4rem;
}
</style>
