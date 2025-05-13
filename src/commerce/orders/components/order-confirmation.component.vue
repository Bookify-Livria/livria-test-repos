<script>
export default {
  name: "order-confirmation.component",
  props:{
    orderCode: {
      type: String,
      required: true
    }
  },
  methods: {
    closeConfirmation() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div>
    <div id="overlay" @click="closeConfirmation"></div>
    <div class="confirmation__container">
      <h3 class="h1__title go--orange">{{ $t("confirmation.thanks-title")}}</h3>
      <div class="confirmation__content">
        <div class="confirmation__logo">
          <img class="logo" src="../../../assets/images/logo/logo_icon.png" alt="livria_logo" />
        </div>
        <div class="confirmation__message">
          <p>
            {{ $t("confirmation.thanks-text")}}
          </p>
          <strong>{{ $t("confirmation.order")}} {{ orderCode }}</strong>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
*{
  outline: none;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 998;
}

.confirmation__container {
  background-color: var(--color-background);
  padding: 3rem;
  gap: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  margin: 2rem auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.confirmation__content {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  height: 240px;
}

.confirmation__logo {
  background-color: rgba(var(--color-blue-rgb), 0.15);
  padding: 2rem;
  border-radius: 10px;
  height: 100%;
}

.logo {
  width: auto;
  height: 100%;
}

.confirmation__message {
  background-color: rgba(var(--color-accent-yellow-rgb), 0.15);
  padding: 2rem;
  border-radius: 10px;
  font-size: 1rem;
  color: var(--color-text);
  height: 100%;
}

.confirmation__message strong {
  display: block;
  margin: 2rem 0;
  text-transform: uppercase;
}

</style>