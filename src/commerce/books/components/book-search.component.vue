<script>
import BookItem from './book-item.component.vue'
import { BookApiService } from '../services/book-api.service.js'
import Recommendation from './recommended-books.component.vue'

export default {
  name: 'bookSearch',
  components: {
    BookItem,
    Recommendation
  },
  data() {
    return {
      books: [],
      sortOption: '',
      selectedLanguages: []
    }
  },
  computed: {
    searchQuery() {
      return this.$route.query.q?.toLowerCase() || ''
    },
    filteredBooks() {
      let filtered = this.books.filter(book =>
          book.title.toLowerCase().includes(this.searchQuery) ||
          book.author.toLowerCase().includes(this.searchQuery) )

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
  <div class="search-title">
    <h1 class="h1__title">
      {{ $t('Search') }} "<span class="highlight">{{ $route.query.q }}</span>"
    </h1>
  </div>

  <div class="book-view-container">

    <div class="book-grid">
      <div
          v-for="book in filteredBooks"
          :key="book.id"
          class="custom-card-wrapper"
      >
        <BookItem :book="book" />
      </div>
      <div v-if="filteredBooks.length === 0" class="no-results">
        <h2 class="h3__title">{{ $t('NoSearch') }}</h2>
        <h2 class="h3__title">{{ $t('RecoSearch') }}</h2>
        <Recommendation />
      </div>
    </div>

    <div class="filter-panel">
      <pv-card>
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
      </pv-card>
    </div>
  </div>


</template>

<style scoped>

.search-title{
  margin-top: 10rem;
  margin-right: 19rem;
}
.book-view-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  flex-wrap: wrap;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  row-gap: 3rem;
  column-gap: 1rem;
  flex: 3;
}

.custom-card-wrapper {
  width: 300px;
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