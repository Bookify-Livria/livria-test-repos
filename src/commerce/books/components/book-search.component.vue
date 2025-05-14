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

            <button @click="resetFilters">{{ $t('delete') }}</button>
          </div>
        </template>
      </pv-card>
    </div>
  </div>


</template>

<style scoped>

.book-view-container {
  display: flex;
  gap: 3rem;
  padding: 2rem;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  row-gap: 3rem;
  column-gap: 2rem;
  flex: 3;
  justify-content: flex-start;
}

.p-card:hover {
  transform: scale(1.02);
}

.filter-panel {
  flex: 1;
  min-width: 350px;
  max-width: 370px;
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.filter-panel .p-card {
  background: rgba(var(--color-secondary-rgb), 0.3);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 16px;
}

.filter-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-accent-orange);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-icon {
  font-size: 1.2rem;
  color: currentColor;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
  text-align: left;
}

.filter-options span {
  cursor: pointer;
  color: var(--color-accent-yellow);
  transition: font-weight 0.2s;
}

.subsection {
  margin: 2rem 0;
  text-align: left;
}

.subsection h4 {
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.checkbox-group p {
  margin: 0.3rem 0;
  color: var(--color-primary);
}

.language-option {
  display: inline-block;
  margin-right: 1rem;
  color: var(--color-accent-yellow);
  cursor: pointer;
}

.language-option:hover,
.language-option.selected,
.filter-options span:hover,
.filter-options .active {
  font-weight: bold;
  text-decoration: underline;
  color: var(--color-accent-orange);
}

</style>