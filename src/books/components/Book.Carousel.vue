<script>
import { BookApiService } from '../service/book-api.service.js'

export default {
  name: 'BookCarousel',
  props: {
    genre: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      books: [],
      responsiveOptions: [
        { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
        { breakpoint: '767px', numVisible: 2, numScroll: 1 },
        { breakpoint: '575px', numVisible: 1, numScroll: 1 }
      ]
    }
  },
  mounted() {
    const service = new BookApiService()
    service.getBooks().then(data => {
      this.books = data.filter(book => book.genre?.toLowerCase() === this.genre.toLowerCase())
    })
  }
}
</script>

<template>
  <div class="book-carousel-container">
    <pv-carousel
        :value="books"
        :numVisible="6"
        :numScroll="1"
        :responsiveOptions="responsiveOptions"
        circular
        :autoplayInterval="5000"
        showNavigators
    >
      <template #item="slotProps">
        <div class="custom-card-wrapper">
          <pv-card>
            <template #header>
              <img :src="slotProps.data.cover" :alt="slotProps.data.title" class="book-cover" />
            </template>
            <template #title>
              <div class="book-title">{{ slotProps.data.title }}</div>
            </template>
            <template #subtitle>
              <div class="book-subtitle">
                <span class="book-author">{{ slotProps.data.author }}</span>
                <span class="book-price">S/ {{ slotProps.data.price.toFixed(2) }}</span>
              </div>
            </template>
          </pv-card>
        </div>
      </template>
    </pv-carousel>
  </div>
</template>

<style scoped>
.book-carousel-container {
  width: 100%;
  padding: 0 2rem 2rem;
  margin: 0;
}

.book-cover {
  width: 160px;
  height: 260px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin: 0 auto 1rem auto;
  display: block;
}

.custom-card-wrapper {
  background-color: var(--color-light);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 1rem;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
  text-align: left;
}

.book-subtitle {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
}

.book-author {
  font-size: 0.85rem;
  color: #666;
}

.book-price {
  font-size: 0.9rem;
  font-weight: 500;
}

</style>

