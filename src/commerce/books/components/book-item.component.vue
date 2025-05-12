<script>

export default {
  name: 'BookItem',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToDetail() {
      this.$router.push({ name: 'BookDetail', params: { title: this.book.title } })
    }
  }
}
</script>

<template>

  <div v-if="book" class="book-item-container" @click="goToDetail">
    <pv-card>
      <template #header>
        <img :src="book.cover" :alt="book.title" class="book-cover" />
      </template>
      <template #title>
        <div class="book-title">{{ book.title }}</div>
      </template>
      <template #subtitle>
        <div class="book-subtitle">{{ book.author }}</div>
      </template>
      <template #footer>
        <div class="book-subtitle book-price">S/ {{ book.price.toFixed(2) }}</div>
      </template>
    </pv-card>
  </div>
  <div v-else>
    <p>{{ $t('loading-book') }}</p>
  </div>

</template>

<style scoped>
.book-item-container {
  background-color: var(--color-light);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.book-item-container:hover {
  transform: scale(1.02);
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

.book-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
  text-align: center;
}

.book-subtitle {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;
}

.book-price {
  font-weight: 600;
  margin-top: 1rem;
}
</style>