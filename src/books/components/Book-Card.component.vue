<script>
import Card from 'primevue/card'
import { BookApiService } from '../service/book-api.service.js'

export default {
  name: 'BookCardComponent',
  props: {
    genre: {
      type: String,
      required: true
    }
  },
  components: {
    Card
  },
  data() {
    return {
      books: [],
      sortOption: '',
      selectedLanguages: []
    }
  },
  computed: {
    filteredBooks() {
      let filtered = this.books.filter(book => book.genre === this.genre)

      if (this.selectedLanguages.length > 0) {
        filtered = filtered.filter(book =>
            this.selectedLanguages.includes(book.language)
        )
      }

      switch (this.sortOption) {
        case 'titleAsc':
          return filtered.sort((a, b) => a.title.localeCompare(b.title))
        case 'titleDesc':
          return filtered.sort((a, b) => b.title.localeCompare(a.title))
        case 'priceAsc':
          return filtered.sort((a, b) => a.price - b.price)
        case 'priceDesc':
          return filtered.sort((a, b) => b.price - a.price)
        default:
          return filtered
      }
    }
  },
  mounted() {
    const service = new BookApiService()
    service.getBooks().then(data => {
      this.books = data
    })
  },
  methods: {
    toggleLanguage(lang) {
      if (this.selectedLanguages.includes(lang)) {
        this.selectedLanguages = this.selectedLanguages.filter(l => l !== lang)
      } else {
        this.selectedLanguages.push(lang)
      }
    },
    resetFilters() {
      this.sortOption = ''
      this.selectedLanguages = []
    }
  }
}
</script>

<template>
  <div class="book-view-container">

    <div class="book-grid">

      <div
          v-for="book in filteredBooks"
          :key="book.id"
          class="custom-card-wrapper"
      >

        <Card>
          <template #header>
            <div class="cover-container">
              <img :src="book.cover" :alt="book.title" class="book-cover" />
            </div>
          </template>
          <template #title>
            <div class="book-title">{{ book.title }}</div>
          </template>
          <template #subtitle>
            <div class="book-author">{{ book.author }}</div>
          </template>
          <template #footer>
            <div class="book-price">S/ {{ book.price.toFixed(2) }}</div>
          </template>
        </Card>
      </div>
    </div>

    <div class="filter-panel">
      <Card>
        <template #title>
          <div class="filter-title">
            <span class="ordenar-label">{{ $t('sort') }}</span>
            <i class="pi pi-sliders-h filter-icon"></i>
          </div>

          <div class="filter-section">
            <div class="filter-options">
              <span @click="sortOption = 'titleAsc'" :class="{ active: sortOption === 'titleAsc' }">{{ $t('titleaz') }}</span>
              <span @click="sortOption = 'titleDesc'" :class="{ active: sortOption === 'titleDesc' }">{{ $t('titleza') }}</span>
              <span @click="sortOption = 'priceAsc'" :class="{ active: sortOption === 'priceAsc' }">{{ $t('pricelower') }}</span>
              <span @click="sortOption = 'priceDesc'" :class="{ active: sortOption === 'priceDesc' }">{{ $t('pricehigher') }}</span>
            </div>

            <div class="subsection">
              <h4>{{ $t('language') }}</h4>
              <span
                  class="language-option"
                  :class="{ selected: selectedLanguages.includes('en') }"
                  @click="toggleLanguage('en')"
              >{{ $t('english') }}</span>
              <span
                  class="language-option"
                  :class="{ selected: selectedLanguages.includes('es') }"
                  @click="toggleLanguage('es')"
              >{{ $t('spanish') }}</span>
            </div>

            <button @click="resetFilters" class="reset-button">{{ $t('delete') }}</button>
          </div>
        </template>

      </Card>
    </div>
  </div>
</template>

<style scoped>
.book-view-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  flex-wrap: wrap;
}
.cover-container {
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  row-gap: 4.2rem;
  column-gap: 4rem;
  flex: 3;
}

.custom-card-wrapper {
  width: 250px;

}

.p-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.p-card:hover {
  transform: scale(1.02);
}

.book-cover {
  width: 150px;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
}

.book-title {
  font-weight: bold;
  font-size: 1rem;
  color: #333;
}

.book-author {
  font-size: 0.9rem;
  color: #666;
}

.book-price {
  margin-top: 0.5rem;
  font-weight: bold;
}

.filter-panel {
  flex: 1;
  min-width: 280px;
  max-width: 300px;
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.filter-panel .p-card {
  background: #eefafa;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  border-radius: 16px;
}

.filter-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f2540e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-icon {
  font-size: 1.2rem;
  color: #f2540e;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.filter-options span {
  cursor: pointer;
  color: #f2a700;
  transition: font-weight 0.2s;
}

.filter-options .active {
  font-weight: bold;
  text-decoration: underline;
}

.subsection {
  margin-top: 1.5rem;
}

.subsection h4 {
  color: #003b5c;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.checkbox-group p {
  margin: 0.3rem 0;
  color: #003b5c;
}

.language-option {
  display: inline-block;
  margin-right: 1rem;
  color: #f2a700;
  cursor: pointer;
}

.language-option.selected {
  font-weight: bold;
  text-decoration: underline;
}

.reset-button {
  margin-top: 2rem;
  background-color: #d3f1f8;
  border: none;
  color: #008c9e;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}
</style>
