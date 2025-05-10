<script>
import { CommunityApiService } from '../service/community-api.service'

export default {
  name: 'CreateCommunity',
  data() {
    return {
      newCommunity: {
        name: '',
        description: '',
        type: '',
        image: ''
      }
    }
  },
  methods: {
    saveCommunity() {
      const service = new CommunityApiService()
      const neww = { ...this.newCommunity, id: Date.now() }
      service.createCommunity(neww).then(() => {
        this.$emit('created', neww)
        this.newCommunity = { name: '', description: '', type: '', image: '' }
      })
    },
    closeForm() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div>
    <div id="overlay" @click="closeForm"></div>
    <div id="formContainer">
      <form @submit.prevent="saveCommunity">
        <pv-button type="submit" class="submit-button">{{ $t('create-community')}}</pv-button>
        <input type="text" v-model="newCommunity.name" :placeholder="$t('form.name')" class="form-input" required>
        <textarea v-model="newCommunity.type" :placeholder="$t('form.category')" class="form-input" required></textarea>
        <input type="text" v-model="newCommunity.description" :placeholder="$t('form.description')" class="form-input" required>
        <input type="url" v-model="newCommunity.image" :placeholder="$t('form.image')" class="form-input" required>
      </form>
    </div>
  </div>
</template>

<style scoped>
#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

#formContainer {
  color: var(--color-accent-light-yellow);
  width: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-background);
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 999;
}

#formContainer form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 1rem;
}

.form-input {
  background-color: rgba(var(--color-accent-yellow-rgb), 0.15);
  margin: 1rem 0;
  padding: 1rem;
  width: 90%;
  border-radius: 5px;
  border: 1px solid var(--color-background);
}

.form-input,
textarea {
  color: var(--color-text);
}

.form-input::placeholder,
textarea::placeholder {
  color: var(--color-accent-light-yellow);
  font-family: var(--font-primary);

}

.form-input:focus {
  border-color: var(--color-background);
}

.submit-button {
  background-color: rgba(var(--color-accent-orange-rgb), 0.15);
  color: var(--color-accent-orange);
  text-transform: uppercase;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;

}

.submit-button.p-button:hover,
.submit-button.p-button:focus,
.submit-button.p-button:active {
  background-color: var(--color-accent-orange) !important;
  color: var(--color-light) !important;
  border-color: transparent !important;
}

</style>
