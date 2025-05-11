<script>
import BookItem from './book-item.component.vue'
import { BookApiService } from '../services/book-api.service.js'

export default {
  name: "recommended-books",
  components: {
    BookItem
  },
  data() {
    return {
      books: [],
    };
  },
  created() {
    const api = new BookApiService();
    api.getBooks().then((data) => {
      this.books = data.slice(0, 6);
    });
  },
};
</script>

<template>
  <div class="recommended__container">
    <h2 class="recommended__title">{{ $t("recommended.title") }}</h2>
    <p class="recommended__subtitle">{{ $t("recommended.subtitle") }}</p>

    <div class="recommended__cards">
      <div
          v-for="book in books"
          :key="book.id"
          class="custom-card-wrapper"
      >
        <BookItem :book="book" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommended__container {
  padding: 2rem;
  text-align: center;
}

.recommended__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #003366;
  margin-bottom: 0.5rem;
}

.recommended__subtitle {
  margin-bottom: 2rem;
  color: #555;
}

.recommended__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.custom-card-wrapper {
  width: 300px;
}
</style>
