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
  created() { // Al crear el componente, se obtiene la información de todos los libros almacenados en la Fake API
    const api = new BookApiService();
    api.getBooks().then((data) => {
      this.books = data.slice(0, 6);
    });
  },
};
</script>

<template>
  <div class="recommended__container" aria-label="Recommended books">
    <div class="recommended__cards">
      <div
          v-for="book in books"
          :key="book.id"
          class="custom-card-wrapper"
      >
        <BookItem :book="book" aria-label="Book information"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommended__container {
  padding: 2rem 0;
}

.recommended__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  height: 400px;
}

.custom-card-wrapper {
  margin: 0;
  height: 100%;
}
</style>