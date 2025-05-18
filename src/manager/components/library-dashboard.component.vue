<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { BookApiService } from '../../commerce/books/services/book-api.service.js'

export default {
  name: "LibraryDashboard",
  setup() {
    const router = useRouter();
    const books = ref([]);
    const genres = ref([]);
    const stats = ref({
      totalBooks: 0,
      totalGenres: 0,
      averagePrice: 0,
      mostReviewedBook: null,
      booksInStock: 0,
      bestSellingBook: null
    });
    const loading = ref(true);
    const selectedGenre = ref('all');
    const selectedLanguage = ref('all');
    const sortOption = ref('title');
    const searchQuery = ref('');
    const showEditModal = ref(false);
    const currentBook = ref(null);
    const formErrors = ref({});

    // Language options
    const languages = ref([
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' },
    ]);

    const loadBooks = async () => {
      try {
        loading.value = true;
        const service = new BookApiService();
        const data = await service.getBooks();
        books.value = data;

        // Extract unique genres
        const uniqueGenres = [...new Set(data.map(book => book.genre))];
        genres.value = uniqueGenres;

        // Calculate statistics
        calculateStats(data);

        loading.value = false;
      } catch (error) {
        console.error('Error loading books:', error);
        loading.value = false;
      }
    };

    const calculateStats = (books) => {
      if (!books.length) return;

      stats.value.totalBooks = books.length;
      stats.value.totalGenres = [...new Set(books.map(book => book.genre))].length;

      // Calculate average price
      const totalPrice = books.reduce((sum, book) => sum + book.price, 0);
      stats.value.averagePrice = totalPrice / books.length;

      // Find most reviewed book
      let mostReviewed = books[0];
      books.forEach(book => {
        if ((book.reviews?.length || 0) > (mostReviewed.reviews?.length || 0)) {
          mostReviewed = book;
        }
      });
      stats.value.mostReviewedBook = mostReviewed;

      // Count books in stock
      stats.value.booksInStock = books.filter(book => book.stock > 0).length;

      // Find best selling book (mock data)
      stats.value.bestSellingBook = books.reduce((best, current) => {
        return (current.sales || 0) > (best.sales || 0) ? current : best;
      }, books[0]);
    };

    const filteredBooks = computed(() => {
      let filtered = [...books.value];

      // Filter by genre
      if (selectedGenre.value !== 'all') {
        filtered = filtered.filter(book => book.genre === selectedGenre.value);
      }

      // Filter by language
      if (selectedLanguage.value !== 'all') {
        filtered = filtered.filter(book => book.language === selectedLanguage.value);
      }

      // Filter by search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
      }

      // Sort books
      filtered.sort((a, b) => {
        switch (sortOption.value) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'reviews':
            return (b.reviews?.length || 0) - (a.reviews?.length || 0);
          default:
            return 0;
        }
      });

      return filtered;
    });

    const navigateToBook = (book) => {
      router.push(`/books/${encodeURIComponent(book.title)}`);
    };

    const editBook = (book) => {
      currentBook.value = { ...book };
      showEditModal.value = true;
      formErrors.value = {};
    };

    const validateForm = () => {
      const errors = {};

      if (!currentBook.value.title || currentBook.value.title.trim() === '') {
        errors.title = 'El título es obligatorio';
      }

      if (!currentBook.value.author || currentBook.value.author.trim() === '') {
        errors.author = 'El autor es obligatorio';
      }

      if (isNaN(currentBook.value.price) || currentBook.value.price <= 0) {
        errors.price = 'El precio debe ser un número mayor que 0';
      }

      if (isNaN(currentBook.value.stock) || currentBook.value.stock < 0) {
        errors.stock = 'El stock debe ser un número no negativo';
      }

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    const saveBook = async () => {
      if (!validateForm()) return;

      try {
        const service = new BookApiService();
        await service.updateBook(currentBook.value.id, currentBook.value);

        // Update the book in the local array
        const index = books.value.findIndex(book => book.id === currentBook.value.id);
        if (index !== -1) {
          books.value[index] = { ...currentBook.value };
        }

        showEditModal.value = false;
        calculateStats(books.value);
      } catch (error) {
        console.error('Error updating book:', error);
      }
    };

    const closeModal = () => {
      showEditModal.value = false;
      currentBook.value = null;
    };

    const getLanguageName = (code) => {
      const lang = languages.value.find(lang => lang.code === code);
      return lang ? lang.name : code;
    };

    onMounted(() => {
      loadBooks();
    });

    return {
      books,
      genres,
      stats,
      loading,
      selectedGenre,
      selectedLanguage,
      sortOption,
      searchQuery,
      filteredBooks,
      showEditModal,
      currentBook,
      formErrors,
      languages,
      navigateToBook,
      editBook,
      saveBook,
      closeModal,
      getLanguageName
    };
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">{{ $t('dashboard.title') || 'Gestión de Biblioteca' }}</h1>
      <p class="dashboard-subtitle">{{ $t('dashboard.subtitle') || 'Administra y analiza tu colección de libros' }}</p>
    </div>

    <div v-if="loading" class="dashboard-loading">
      <p>{{ $t('loading') || 'Cargando datos...' }}</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- Stats Cards -->
      <div class="stats-container">
        <div class="stat-card">
          <h3>{{ $t('dashboard.total-books') || 'Total Libros' }}</h3>
          <p class="stat-value">{{ stats.totalBooks }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.total-genres') || 'Géneros' }}</h3>
          <p class="stat-value">{{ stats.totalGenres }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.avg-price') || 'Precio Promedio' }}</h3>
          <p class="stat-value">S/ {{ stats.averagePrice.toFixed(2) }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.books-in-stock') || 'Libros en Stock' }}</h3>
          <p class="stat-value">{{ stats.booksInStock }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.most-reviewed') || 'Más Reseñado' }}</h3>
          <p class="stat-value">{{ stats.mostReviewedBook?.title || 'N/A' }}</p>
          <p class="stat-detail" v-if="stats.mostReviewedBook">
            {{ stats.mostReviewedBook.reviews?.length || 0 }} {{ $t('dashboard.reviews') || 'reseñas' }}
          </p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.best-selling') || 'Más Vendido' }}</h3>
          <p class="stat-value">{{ stats.bestSellingBook?.title || 'N/A' }}</p>
          <p class="stat-detail" v-if="stats.bestSellingBook">
            {{ stats.bestSellingBook.sales || 0 }} {{ $t('dashboard.copies') || 'copias' }}
          </p>
        </div>
      </div>

      <!-- Filter and Search Options -->
      <div class="filter-section">
        <h2 class="section-title">{{ $t('dashboard.book-collection') || 'Colección de Libros' }}</h2>

        <div class="search-bar">
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('dashboard.search-books') || 'Buscar por título o autor...'"
              class="search-input"
          />
        </div>

        <div class="filter-controls">
          <div class="filter-group">
            <label for="genre-filter">{{ $t('dashboard.filter-by-genre') || 'Filtrar por Género:' }}</label>
            <select id="genre-filter" v-model="selectedGenre" class="filter-select">
              <option value="all">{{ $t('dashboard.all-genres') || 'Todos los Géneros' }}</option>
              <option v-for="genre in genres" :key="genre" :value="genre">
                {{ $t(`genres.${genre}`) || genre }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="language-filter">{{ $t('dashboard.filter-by-language') || 'Filtrar por Idioma:' }}</label>
            <select id="language-filter" v-model="selectedLanguage" class="filter-select">
              <option value="all">{{ $t('dashboard.all-languages') || 'Todos los Idiomas' }}</option>
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="sort-by">{{ $t('dashboard.sort-by') || 'Ordenar por:' }}</label>
            <select id="sort-by" v-model="sortOption" class="filter-select">
              <option value="title">{{ $t('dashboard.sort-title') || 'Título (A-Z)' }}</option>
              <option value="price_asc">{{ $t('dashboard.sort-price-asc') || 'Precio (Menor a Mayor)' }}</option>
              <option value="price_desc">{{ $t('dashboard.sort-price-desc') || 'Precio (Mayor a Menor)' }}</option>
              <option value="reviews">{{ $t('dashboard.sort-reviews') || 'Más Reseñas' }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Books Grid -->
      <div class="books-grid">
        <div
            v-for="book in filteredBooks"
            :key="book.id"
            class="book-card"
        >
          <div class="book-cover" @click="navigateToBook(book)">
            <img :src="book.cover" :alt="book.title" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-price">S/ {{ book.price.toFixed(2) }}</p>
            <div class="book-meta">
              <span class="book-language">{{ getLanguageName(book.language) }}</span>
              <span class="book-stock">Stock: {{ book.stock || 0 }}</span>
            </div>
            <div class="book-reviews">
              <span>{{ book.reviews?.length || 0 }} {{ $t('dashboard.reviews') || 'reseñas' }}</span>
            </div>
            <div class="book-actions">
              <button class="btn-edit" @click="editBook(book)">
                {{ $t('dashboard.edit') || 'Editar' }}
              </button>
              <button class="btn-view" @click="navigateToBook(book)">
                {{ $t('dashboard.view') || 'Ver' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredBooks.length === 0" class="no-results">
          <p>{{ $t('dashboard.no-books-found') || 'No se encontraron libros con los filtros seleccionados.' }}</p>
        </div>
      </div>
    </div>

    <!-- Edit Book Modal -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ $t('dashboard.edit-book') || 'Editar Libro' }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body" v-if="currentBook">
          <div class="form-group">
            <label for="book-title">{{ $t('dashboard.book-title') || 'Título' }}:</label>
            <input type="text" id="book-title" v-model="currentBook.title" class="form-control" />
            <span class="error-message" v-if="formErrors.title">{{ formErrors.title }}</span>
          </div>

          <div class="form-group">
            <label for="book-author">{{ $t('dashboard.book-author') || 'Autor' }}:</label>
            <input type="text" id="book-author" v-model="currentBook.author" class="form-control" />
            <span class="error-message" v-if="formErrors.author">{{ formErrors.author }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="book-price">{{ $t('dashboard.book-price') || 'Precio' }}:</label>
              <input type="number" id="book-price" v-model.number="currentBook.price" class="form-control" step="0.01" />
              <span class="error-message" v-if="formErrors.price">{{ formErrors.price }}</span>
            </div>

            <div class="form-group">
              <label for="book-stock">{{ $t('dashboard.book-stock') || 'Stock' }}:</label>
              <input type="number" id="book-stock" v-model.number="currentBook.stock" class="form-control" />
              <span class="error-message" v-if="formErrors.stock">{{ formErrors.stock }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="book-genre">{{ $t('dashboard.book-genre') || 'Género' }}:</label>
            <select id="book-genre" v-model="currentBook.genre" class="form-control">
              <option v-for="genre in genres" :key="genre" :value="genre">
                {{ $t(`genres.${genre}`) || genre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="book-language">{{ $t('dashboard.book-language') || 'Idioma' }}:</label>
            <select id="book-language" v-model="currentBook.language" class="form-control">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="book-description">{{ $t('dashboard.book-description') || 'Descripción' }}:</label>
            <textarea id="book-description" v-model="currentBook.description" class="form-control" rows="4"></textarea>
          </div>

          <div class="form-group">
            <label for="book-cover">{{ $t('dashboard.book-cover') || 'URL de Portada' }}:</label>
            <input type="text" id="book-cover" v-model="currentBook.cover" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">{{ $t('dashboard.cancel') || 'Cancelar' }}</button>
          <button class="btn-save" @click="saveBook">{{ $t('dashboard.save') || 'Guardar Cambios' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  padding: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.dashboard-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-accent-orange);
}

.stat-detail {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-top: 0.5rem;
}

.filter-section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.filter-select {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.9rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.book-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.book-cover {
  height: 260px;
  overflow: hidden;
  cursor: pointer;
  padding: 10px;
}

.book-cover img {
  width: auto;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-cover:hover img {
  transform: scale(1.05);
}

.book-info {
  padding: 1.5rem;
  padding-top: .1rem;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.book-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-accent-orange);
  margin-bottom: 0.75rem;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.book-reviews {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.book-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-view {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: var(--color-primary);
  color: white;
}

.btn-edit:hover {
  background-color: #005a87;
}

.btn-view {
  background-color: var(--color-accent-orange);
  color: white;
}

.btn-view:hover {
  background-color: #d17000;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--color-text);
  opacity: 0.7;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.form-control {
  width: 100%;
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
}

.error-message {
  color: #e53935;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  display: block;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel, .btn-save {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: var(--color-text);
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-save {
  background-color: var(--color-primary);
  color: white;
}

.btn-save:hover {
  background-color: #005a87;
}

@media (max-width: 1200px) {
  .stats-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
    gap: 1.2rem;
  }

  .dashboard-container {
    padding: 1rem;
  }
}
</style>