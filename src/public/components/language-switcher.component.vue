<script>
export default {
  name: "language-switcher.component",
  data() {
    return {
      locale: this.$i18n.locale
    }
  },
  watch: {
    '$i18n.locale'(newVal) {
      this.locale = newVal
    }
  },
  methods: {
    setLocale(lang) {
      this.$i18n.locale = lang
      this.locale = lang
    }
  }
}
</script>

<template>
  <div class="lang-switcher">
    <pv-button
        class="language-btn"
        :class="{ active: locale === 'en' }"
        @click="setLocale('en')"
    >
      EN
    </pv-button>
    <pv-button
        class="language-btn"
        :class="{ active: locale === 'es' }"
        @click="setLocale('es')"
    >
      ES
    </pv-button>
  </div>
</template>

<style scoped>

.lang-switcher {
  display: flex;
  gap: 10px;
}

.language-btn {
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  opacity: 0.6;
  font-family: var(--font-heading);
  font-size: 18px;
  color: var(--color-text);
}

.language-btn:hover,
.language-btn.active {
  opacity: 1;
  font-weight: 700;
  color: var(--color-accent-orange);
}

</style>
