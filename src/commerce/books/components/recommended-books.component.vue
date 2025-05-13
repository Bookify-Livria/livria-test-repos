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
    <div class="recommended__cards">
      <div
          v-for="book in books"
          :key="book.id"
          class="custom-card-wrapper"
      >
        <BookItem :book="book"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommended__container {
  padding: 2rem;
  text-align: center;
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