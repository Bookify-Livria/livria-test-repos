<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: "EditGenre",
  setup() {
    const router = useRouter();
    const genres = ref([]);
    const loading = ref(true);
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const currentGenre = ref(null);
    const newGenre = ref({
      name: '',
      description: '',
      icon: 'pi pi-tag',
      active: true
    });
    const formErrors = ref({});
    const searchQuery = ref('');

    const loadGenres = async () => {
      try {
        loading.value = true;
        const service = new GenreApiService();
        const data = await service.getGenres();
        genres.value = data;
        loading.value = false;
      } catch (error) {
        console.error('Error loading genres:', error);
        loading.value = false;
      }
    };

    const filteredGenres = computed(() => {
      if (!searchQuery.value.trim()) {
        return genres.value;
      }

      const query = searchQuery.value.toLowerCase();
      return genres.value.filter(genre =>
          genre.name.toLowerCase().includes(query) ||
          (genre.description && genre.description.toLowerCase().includes(query))
      );
    });

    const openAddModal = () => {
      newGenre.value = {
        name: '',
        description: '',
        icon: 'pi pi-tag',
        active: true
      };
      formErrors.value = {};
      showAddModal.value = true;
    };

    const closeAddModal = () => {
      showAddModal.value = false;
    };

    const openEditModal = (genre) => {
      currentGenre.value = { ...genre };
      formErrors.value = {};
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
      currentGenre.value = null;
    };

    const validateForm = (genre) => {
      const errors = {};

      if (!genre.name || genre.name.trim() === '') {
        errors.name = 'El nombre es obligatorio';
      }

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    const addGenre = async () => {
      if (!validateForm(newGenre.value)) return;

      try {
        const service = new GenreApiService();
        const addedGenre = await service.createGenre(newGenre.value);
        genres.value.push(addedGenre);
        showAddModal.value = false;
      } catch (error) {
        console.error('Error adding genre:', error);
      }
    };

    const updateGenre = async () => {
      if (!validateForm(currentGenre.value)) return;

      try {
        const service = new GenreApiService();
        await service.updateGenre(currentGenre.value.id, currentGenre.value);

        // Update the genre in the local array
        const index = genres.value.findIndex(genre => genre.id === currentGenre.value.id);
        if (index !== -1) {
          genres.value[index] = { ...currentGenre.value };
        }

        showEditModal.value = false;
      } catch (error) {
        console.error('Error updating genre:', error);
      }
    };

    const deleteGenre = async (genreId) => {
      if (confirm($t('genres.confirm-delete') || '¿Está seguro de que desea eliminar este género?')) {
        try {
          const service = new GenreApiService();
          await service.deleteGenre(genreId);
          genres.value = genres.value.filter(genre => genre.id !== genreId);
        } catch (error) {
          console.error('Error deleting genre:', error);
        }
      }
    };

    const toggleGenreStatus = async (genre) => {
      try {
        const updatedGenre = { ...genre, active: !genre.active };
        const service = new GenreApiService();
        await service.updateGenre(genre.id, updatedGenre);

        // Update the genre in the local array
        const index = genres.value.findIndex(g => g.id === genre.id);
        if (index !== -1) {
          genres.value[index].active = updatedGenre.active;
        }
      } catch (error) {
        console.error('Error toggling genre status:', error);
      }
    };

    // Available icons for selection
    const availableIcons = ref([
      'pi pi-tag',
      'pi pi-book',
      'pi pi-heart',
      'pi pi-star',
      'pi pi-globe',
      'pi pi-map',
      'pi pi-briefcase',
      'pi pi-camera',
      'pi pi-music',
      'pi pi-palette',
      'pi pi-desktop',
      'pi pi-car'
    ]);

    onMounted(() => {
      loadGenres();
    });

    return {
      genres,
      loading,
      showAddModal,
      showEditModal,
      currentGenre,
      newGenre,
      formErrors,
      searchQuery,
      filteredGenres,
      availableIcons,
      openAddModal,
      closeAddModal,
      openEditModal,
      closeEditModal,
      addGenre,
      updateGenre,
      deleteGenre,
      toggleGenreStatus
    };
  }
};
</script>

<template>
  <div class="genre-manager-container">
    <div class="genre-manager-header">
      <h1 class="genre-manager-title">{{ $t('genres.title') || 'Gestión de Géneros' }}</h1>
      <p class="genre-manager-subtitle">{{ $t('genres.subtitle') || 'Administra los géneros y categorías de libros' }}</p>
    </div>

    <div v-if="loading" class="genre-manager-loading">
      <p>{{ $t('loading') || 'Cargando datos...' }}</p>
    </div>

    <div v-else class="genre-manager-content">
      <div class="genre-actions">
        <div class="search-bar">
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('genres.search') || 'Buscar géneros...'"
              class="search-input"
          />
        </div>
        <button class="btn-add" @click="openAddModal">
          <i class="pi pi-plus"></i>
          {{ $t('genres.add-new') || 'Añadir Género' }}
        </button>
      </div>

      <div class="genres-grid">
        <div v-for="genre in filteredGenres" :key="genre.id" class="genre-card">
          <div class="genre-icon">
            <i :class="genre.icon"></i>
          </div>
          <div class="genre-info">
            <h3 class="genre-name">{{ genre.name }}</h3>
            <p v-if="genre.description" class="genre-description">{{ genre.description }}</p>
            <div class="genre-status" :class="{ 'status-active': genre.active, 'status-inactive': !genre.active }">
              {{ genre.active ? ($t('genres.active') || 'Activo') : ($t('genres.inactive') || 'Inactivo') }}
            </div>
          </div>
          <div class="genre-actions">
            <button class="btn-toggle" @click="toggleGenreStatus(genre)" :title="genre.active ? 'Desactivar' : 'Activar'">
              <i :class="genre.active ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
            <button class="btn-edit" @click="openEditModal(genre)" title="Editar">
              <i class="pi pi-pencil"></i>
            </button>
            <button class="btn-delete" @click="deleteGenre(genre.id)" title="Eliminar">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>

        <div v-if="filteredGenres.length === 0" class="no-results">
          <p>{{ $t('genres.no-genres-found') || 'No se encontraron géneros con los filtros seleccionados.' }}</p>
        </div>
      </div>
    </div>

    <!-- Add Genre Modal -->
    <div v-if="showAddModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ $t('genres.add-genre') || 'Añadir Género' }}</h2>
          <button class="close-btn" @click="closeAddModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="genre-name">{{ $t('genres.name') || 'Nombre' }}:</label>
            <input type="text" id="genre-name" v-model="newGenre.name" class="form-control" />
            <span class="error-message" v-if="formErrors.name">{{ formErrors.name }}</span>
          </div>

          <div class="form-group">
            <label for="genre-description">{{ $t('genres.description') || 'Descripción' }}:</label>
            <textarea id="genre-description" v-model="newGenre.description" class="form-control" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>{{ $t('genres.icon') || 'Icono' }}:</label>
            <div class="icon-selection">
              <div
                  v-for="icon in availableIcons"
                  :key="icon"
                  class="icon-option"
                  :class="{ 'selected': newGenre.icon === icon }"
                  @click="newGenre.icon = icon"
              >
                <i :class="icon"></i>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="genre-active">{{ $t('genres.status') || 'Estado' }}:</label>
            <div class="toggle-switch">
              <input type="checkbox" id="genre-active" v-model="newGenre.active" />
              <label for="genre-active">{{ newGenre.active ? ($t('genres.active') || 'Activo') : ($t('genres.inactive') || 'Inactivo') }}</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeAddModal">{{ $t('genres.cancel') || 'Cancelar' }}</button>
          <button class="btn-save" @click="addGenre">{{ $t('genres.add') || 'Añadir' }}</button>
        </div>
      </div>
    </div>

    <!-- Edit Genre Modal -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ $t('genres.edit-genre') || 'Editar Género' }}</h2>
          <button class="close-btn" @click="closeEditModal">&times;</button>
        </div>
        <div class="modal-body" v-if="currentGenre">
          <div class="form-group">
            <label for="edit-genre-name">{{ $t('genres.name') || 'Nombre' }}:</label>
            <input type="text" id="edit-genre-name" v-model="currentGenre.name" class="form-control" />
            <span class="error-message" v-if="formErrors.name">{{ formErrors.name }}</span>
          </div>

          <div class="form-group">
            <label for="edit-genre-description">{{ $t('genres.description') || 'Descripción' }}:</label>
            <textarea id="edit-genre-description" v-model="currentGenre.description" class="form-control" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>{{ $t('genres.icon') || 'Icono' }}:</label>
            <div class="icon-selection">
              <div
                  v-for="icon in availableIcons"
                  :key="icon"
                  class="icon-option"
                  :class="{ 'selected': currentGenre.icon === icon }"
                  @click="currentGenre.icon = icon"
              >
                <i :class="icon"></i>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="edit-genre-active">{{ $t('genres.status') || 'Estado' }}:</label>
            <div class="toggle-switch">
              <input type="checkbox" id="edit-genre-active" v-model="currentGenre.active" />
              <label for="edit-genre-active">{{ currentGenre.active ? ($t('genres.active') || 'Activo') : ($t('genres.inactive') || 'Inactivo') }}</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeEditModal">{{ $t('genres.cancel') || 'Cancelar' }}</button>
          <button class="btn-save" @click="updateGenre">{{ $t('genres.save') || 'Guardar Cambios' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.genre-manager-container {
  width: 100%;
  padding: 2rem;
}

.genre-manager-header {
  text-align: center;
  margin-bottom: 2rem;
}

.genre-manager-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.genre-manager-subtitle {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.genre-manager-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.genre-manager-content {
  max-width: 1400px;
  margin: 0 auto;
}

.genre-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-bar {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.btn-add {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #005a87;
}

.btn-add i {
  font-size: 1.1rem;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.genre-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.genre-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.genre-icon {
  width: 50px;
  height: 50px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.genre-icon i {
  font-size: 1.5rem;
}

.genre-info {
  flex: 1;
}

.genre-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.3rem;
}

.genre-description {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.genre-status {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-active {
  background-color: rgba(46, 204, 113, 0.2);
  color: #27ae60;
}

.status-inactive {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.genre-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-toggle, .btn-edit, .btn-delete {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-toggle {
  background-color: #f39c12;
  color: white;
}

.btn-toggle:hover {
  background-color: #e67e22;
}

.btn-edit {
  background-color: var(--color-primary);
  color: white;
}

.btn-edit:hover {
  background-color: #005a87;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
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
  max-width: 500px;
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

.icon-selection {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.icon-option {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-option i {
  font-size: 1.2rem;
  color: var(--color-text);
}

.icon-option.selected {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.icon-option.selected i {
  color: white;
}

.toggle-switch {
  display: flex;
  align-items: center;
}

.toggle-switch input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  display: inline-block;
  position: relative;
  padding-left: 50px;
  cursor: pointer;
}

.toggle-switch label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  transition: background-color 0.2s;
}

.toggle-switch label:after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.2s;
}

.toggle-switch input:checked + label:before {
  background-color: var(--color-primary);
}

.toggle-switch input:checked + label:after {
  left: 22px;
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

@media (max-width: 768px) {
  .genre-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .search-bar {
    width: 100%;
    max-width: 100%;
  }

  .genres-grid {
    grid-template-columns: 1fr;
  }

  .icon-selection {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .genre-card {
    flex-direction: column;
    text-align: center;
  }

  .genre-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .genre-actions {
    margin-top: 1rem;
  }

  .icon-selection {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>