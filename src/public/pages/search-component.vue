<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import BookSearch from "../../commerce/books/components/book-search.component.vue";
import BookDetail from "../../commerce/books/components/book-detail.component.vue";

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
    <div class="search__fullwidth">
      <div class="title__container">
        <h1 class="h1__title">
          {{ $t('Search') }} "<span class="highlight">{{ $route.query.q }}</span>"
        </h1>
      </div>

      <div class="booksearch__container">
          <BookSearch />
      </div>
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

.search__fullwidth {
  padding: 0 2rem;
  margin-bottom: 4rem;
}
</style>
