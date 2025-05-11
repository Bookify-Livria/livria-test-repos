<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import BookDetail from '../../books/components/book-detail.component.vue';

export default {
  name: "book-page.component",
  components: {
    BookDetail,
    footerComponent,
    toolbarComponent
  },
  props: {
    title: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      loadedTitle: null
    }
  },
  computed: {
    bookTitle() {
      return this.loadedTitle || this.$t('loading-book')
    }
  },
  methods: {
    handleBookLoaded(title) {
      this.loadedTitle = title
    }
  }
}
</script>

<template>
  <!-- Header -->
  <toolbarComponent />

  <div class="detail-container">
    <div class="detail__fullwidth">
      <div class="title__container">
        <h1 class="h1__title">{{ bookTitle }}</h1>
      </div>

    </div>

    <div class="info__container">
      <BookDetail @book-loaded="handleBookLoaded" />
    </div>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent />
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.detail__fullwidth {
  padding: 0 2rem;
  margin-bottom: 2rem;
}

.info__container {
  margin-bottom: 4rem;
}

</style>