<script>
import { BookApiService } from '../services/book-api.service.js'
import { CartApiService} from "../../shared-services/cart-api.service.js";

import bookmarkIcon from "../../../assets/images/icons/Bookmark.svg";
import minusIcon from "../../../assets/images/icons/Minus.svg";
import {CommunityApiService} from "../../../communities/service/community-api.service.js";
import {getLoggedInUser} from "../../../public/shared-services/get-logged-user.js";
import {Book} from "../model/book.entity.js";

export default {
  name: 'BookDetail',
  components: {
    bookmarkIcon,
    minusIcon
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      book: null,
      quantity: 1,
      newReview: {
        content: ''
      }
    }
  },
  methods: {
    loadBook() { // Obtiene información del libro seleccionado y asigna su valor a una variable
      const service = new BookApiService()
      const bookTitle = this.$route.params.title

      service.getBooks().then(data => {
        this.book = data.find(b => b.title.toString().toLowerCase() === bookTitle.toLowerCase()) // Busca el título del libro dentro de la Fake API y obtiene sus datos
        if (this.book) {
          this.$emit('book-loaded', this.book.title)
        }
      }).catch(error => {
        console.error('Error loading book:', error)
      })
    },
    async addToCart(book, quantity) { // Agrega al carrito de compras el libro seleccionado, con una cantidad seleccionada por el usuario
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

    showConfirmation() { // Muestra un mensaje flotante (Toast) que indica una inserción exitosa al carrito de compras
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
    },
    async makeReview() { // Permite al usuario registrar una reseña del libro en pantalla
      try {
        const service = new BookApiService();
        const currentUser = await getLoggedInUser();

        if (!this.newReview.content.trim()) {
          return;
        }

        const newId = this.book.reviews?.length
            ? String(Math.max(...this.book.reviews.map(p => parseInt(p.id))) + 1)
            : "1";

        const newReview = {
          id: newId,
          username: currentUser.user,
          content: this.newReview.content,
        };

        const updatedReviews = {
          ...this.book,
          reviews: [...(this.book.reviews || []), newReview]
        };

        await service.updateBook(updatedReviews);

        this.book.reviews.push(newReview);
        this.newReview.content = '';

      } catch (error) {
        console.error('Error posting!!!', error);
      }
    }
  },
  mounted() {
    this.loadBook() // Carga la información del libro al iniciar el componente
  }
}
</script>

<template>

  <div class="book-detail__container" v-if="book" aria-label="Book detail section">
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
        <select v-model="quantity" class="quantity" aria-label="Select quantity">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <div class="book-detail__add-cart">
          <pv-toast position="top-right" style="margin-top: 8.5rem" />
          <button @click="addToCart(book, quantity); showConfirmation()" aria-label="Add to cart">{{ $t('add-to-cart') }}</button>
        </div>
        <span aria-label="Mark as 'interesting'"><bookmarkIcon /></span>
        <span aria-label="Mark as 'not insteresting'"><minusIcon /></span>
      </div>

      <div class="book-detail__opinion">
        <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
        <h3 class="h3__title go--orange">{{$t('comments')}}</h3>
        <div class="book-detail__opinion-post">
          <form @submit.prevent="makeReview">
            <textarea v-model="newReview.content" :placeholder="$t('comm.thoughts')" aria-label="Add comment section"></textarea>
            <button type="submit" class="" aria-label="Publish comment">{{ $t("comm.post")}}</button>
          </form>
        </div>
        <div
            v-for="review in book.reviews.slice().reverse()"
            :key="review.id"
            class="comments"
        >
          <div class="comment">
            <strong>@{{ review.username }}</strong> — {{ review.content }}
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
  height: auto;
}

.book-detail__left-section {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: var(--color-light);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  height: 70vh;
}

.book-detail__image-container {
  width: 400px;
  height: 600px;
}

.book-detail__image-cover {
  height: 100%;
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
  margin-top: 21rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.book-detail__opinion-post {
  margin-bottom: 1rem;
}

.book-detail__opinion-post form {
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

.book-detail__opinion-post textarea {
  flex: 1;
  resize: none;
  padding: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: rgba(var(--color-blue-rgb), 0.15);
  font-family: var(--font-primary);
  font-size: 1rem;
  color: var(--color-text);
}

.book-detail__opinion-post textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-secondary);
}

.book-detail__opinion-post button {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  height: auto;
}

.comments {
  margin-bottom: 0.75rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
}

</style>
