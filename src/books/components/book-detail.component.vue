<script>
import { BookApiService } from '../services/book-api.service.js'
import { CartApiService} from "../../cart/services/cart-api.service.js";

export default {
  name: 'BookDetail',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      book: null,
      quantity: 1
    }
  },
  methods: {
    loadBook() {
      const service = new BookApiService()
      const bookTitle = this.$route.params.title

      service.getBooks().then(data => {
        this.book = data.find(b => b.title.toString().toLowerCase() === bookTitle.toLowerCase())
        if (this.book) {
          this.$emit('book-loaded', this.book.title)
        }
      }).catch(error => {
        console.error('Error loading book:', error)
      })
    },
    async addToCart(book, quantity) {
      try {
        const service = new CartApiService();
        const currentCart = await service.getCart();

        const newId = String(
            currentCart.length > 0
                ? Math.max(...currentCart.map(item => parseInt(item.id))) + 1
                : 1
        );

        const cartItem = {
          id: newId,
          book,
          quantity: parseInt(quantity)
        };
        await service.addToCart(cartItem);
      } catch (error) {
        console.error("Error adding item:", error)
      }
    },
    showConfirmation() {
      try {
        this.$toast.add({
          severity: 'success',
          summary: this.$t('cart.modified'),
          detail: this.$t('cart.book-added'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding item:", error)
      }
    }
  },
  mounted() {
    this.loadBook()
  }
}
</script>

<template>

  <div class="book-detail__container" v-if="book">
    <div class="book-detail__left-section">
      <div class="book-detail__image-container">
        <img :src="book.cover" :alt="book.title" class="book-detail__image-cover" />
      </div>
      <div class="book-detail__description-container">
        <h3 class="h3__title">{{ $t('synopsis')}}</h3>
        <p class="book-detail__description-text">{{ book.description }}</p>
      </div>
    </div>

    <div class="book-detail__right-section">
      <div class="book-detail__details-container">
        <h3 class="h3__title">{{ book.author }}</h3>
        <p class="language">{{ $t('languages.' + book.language) }}</p>
        <p class="price">S/ {{ book.price.toFixed(2) }}</p>
      </div>

      <div class="book-detail__actions">
        <select v-model="quantity" class="quantity">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <div class="book-detail__add-cart">
          <pv-toast position="top-right" style="margin-top: 8.5rem" />
          <button @click="addToCart(book, quantity); showConfirmation()">{{ $t('add-to-cart') }}</button>
        </div>
        <button>Interes</button>
        <button>No Interes</button>
      </div>

      <div class="book-detail__opinion">
        <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
        <div class="comments">
          <h3 class="h3__title go--orange">{{$t('comments')}}</h3>
          <div class="comment">
            <strong>@noaaa</strong> — de mis libros favoritos, 100% recomendado
          </div>
          <div class="comment">
            <strong>@marcelobindap</strong> — me encantó, muy profundo
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>{{ $t('loading-book') }}</p>
  </div>
</template>

<style scoped>
.book-detail__container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 0 2rem;
  margin: 0 2rem;
  position: relative;
}

.book-detail__left-section {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: var(--color-light);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.book-detail__image-container {
  width: 400px;
  height: 600px;
}

.book-detail__image-cover {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.book-detail__description-container {
  text-align: left;
  width: 100%;
  padding: 0 2rem;
}

.book-detail__description-text {
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
}

.book-detail__right-section {
  flex: 0 0 65%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  padding: 0 2rem;
}

.book-detail__details-container {
  margin-bottom: 1rem;
}

.language {
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-accent-orange);
  margin-bottom: 1rem;
}

.book-detail__actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.quantity {
  padding: 0.5rem;
  border-radius: 6px;
}

.book-detail__opinion {
  margin-top: auto;
}

.book-detail__opinion span {
  font-size: 1.5rem;
  color: gold;
  margin-right: 0.25rem;
}

.comments {
  margin-top: 1rem;
}

.comment {
  background-color: var(--color-light);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}
</style>
