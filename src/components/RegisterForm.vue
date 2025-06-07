<template>
  <div class="register-form">
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="nickname">Nickname:</label>
        <input
            id="nickname"
            v-model="registerData.nickname"
            type="text"
            required
        />
      </div>

      <div class="form-group">
        <label for="username">Usuario:</label>
        <input
            id="username"
            v-model="registerData.username"
            type="text"
            required
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
            id="email"
            v-model="registerData.email"
            type="email"
            required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
            id="password"
            v-model="registerData.password"
            type="password"
            required
        />
      </div>

      <div class="form-group">
        <label for="phrase">Frase (opcional):</label>
        <input
            id="phrase"
            v-model="registerData.phrase"
            type="text"
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <div v-if="error" class="error">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import { AuthService } from '../services/auth.service.js';

export default {
  name: 'RegisterForm',
  data() {
    return {
      registerData: {
        nickname: '',
        username: '',
        email: '',
        password: '',
        phrase: '',
        planType: 'basic'
      },
      isLoading: false,
      error: null
    };
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.error = null;

      try {
        const authService = new AuthService();
        const result = await authService.register(this.registerData);

        if (result.success) {
          // Redirigir al usuario
          this.$router.push('/dashboard');
          this.$emit('register-success', result.user);
        } else {
          this.error = result.message;
          if (result.errors && result.errors.length > 0) {
            this.error += ': ' + result.errors.join(', ');
          }
        }
      } catch (error) {
        this.error = 'Error de conexión';
        console.error('Register error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>