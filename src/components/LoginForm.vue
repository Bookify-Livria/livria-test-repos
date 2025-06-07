<template>
  <div class="login-form">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="usernameOrEmail">Usuario o Email:</label>
        <input
            id="usernameOrEmail"
            v-model="loginData.usernameOrEmail"
            type="text"
            required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
            id="password"
            v-model="loginData.password"
            type="password"
            required
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
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
  name: 'LoginForm',
  data() {
    return {
      loginData: {
        usernameOrEmail: '',
        password: ''
      },
      isLoading: false,
      error: null
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.error = null;

      try {
        const authService = new AuthService();
        const result = await authService.login(
            this.loginData.usernameOrEmail,
            this.loginData.password
        );

        if (result.success) {
          // Redirigir al usuario o emitir evento
          this.$router.push('/dashboard');
          // O emitir evento para el componente padre
          this.$emit('login-success', result.user);
        } else {
          this.error = result.message;
        }
      } catch (error) {
        this.error = 'Error de conexión';
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>