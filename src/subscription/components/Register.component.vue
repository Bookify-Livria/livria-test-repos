<script>
import axios from 'axios';

import { ref } from 'vue';
import 'primeicons/primeicons.css';
import {UserApiService} from "../service/user-api.service.js";

export default {
  name: "Register",
  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      info: []
    }
  },

  methods: {
    InvocaAPI() {
      const service = new UserApiService()
      service.getUsers().then(data => {
        this.info = data
        console.log(this.info)
      })
    },

    showFail() {
      try {
        this.$refs.toast.add({
          severity: 'error',
          summary: this.$t('register-fail'),
          detail: this.$t('register-fail-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    showSuccess() {
      try {
        this.$refs.toast.add({
          severity: 'success',
          summary: this.$t('register-success'),
          detail: this.$t('register-success-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    async createUserWithAutoId() {
      if (
          this.value6 === this.value7 &&
          this.value1 &&
          this.value2 &&
          this.value3 &&
          this.value4 &&
          this.value5 &&
          this.value6
      ) {
        try {
          const response = await axios.get('http://localhost:3000/users');
          const users = response.data;

          const newId = users.length > 0
              ? Math.max(...users.map(user => Number(user.id))) + 1
              : 1;

          const newUser = {
            id: newId,
            user: this.value1,
            display: this.value2,
            phrase: this.value3,
            icon: this.value3,
            email: this.value4,
            password: this.value5,
          };

          const result = await axios.post('http://localhost:3000/users', newUser);
          console.log("User created:", result.data);
          this.showSuccess();
          return result.data;

        } catch (error) {
          console.error("Error creating user:", error);
          this.showFail();
        }
      } else {
        console.log("Error: Fields are missing or passwords don't match");
        this.showFail();
      }
    }
  },

  mounted() {
    this.InvocaAPI();
  }
}
</script>

<template>
  <div class="all">
    <div class="head">
      <div class="same-line">
        <img src="https://i.imgur.com/dZ7eqsw.jpg" alt="Logo" width="60px" height="60px">
        <h1 class="name">Livria</h1>
      </div>
    </div>
    <div class="content">
      <pv-card>
        <template #title>{{ $t('register')}}</template>
        <template #content>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('userinput')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text v-model="value1" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('displayinput')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text v-model="value2" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('phraseinput')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text v-model="value3" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('icon-input')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text v-model="value4" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('emailinput')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text inputmode="email" v-model="value5" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('passinput')}}</label>
            </div>

            <div class="input-class">
              <pv-password v-model="value6" class="form-input"/>
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('confpass')}}</label>
            </div>

            <div class="input-class">
              <pv-password v-model="value7" class="form-input"/>
            </div>
          </div>
        </template>

        <template #footer>
          <pv-toast ref="toast"  position="top-right" style="margin-top: 8.5rem" />
          <pv-button type="submit" @click="createUserWithAutoId()" class="form-button">{{ $t('register')}}</pv-button>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>

.all {
  display: block;
  background: white;
  justify-content: space-around;
  justify-items: center;
  width: 70vw;
  height: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  margin-bottom: 0;
}

::v-deep(.p-card-title) {
  text-align: center;
}

.same-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head {
  justify-items: center;
  justify-content: space-between;
  color: black;
  width: 100%;
}

.name{
  margin-left: 15px;
}

.form-group {
  display: block;
  margin-bottom: 1rem;
  align-items: center;
  justify-items: center;
  justify-content: center;
  width: 100%;
}

.form-label {
  min-width: 90px;
  font-size: 1.2rem;
}

.label-class {
  text-align: left;
  justify-content: left;
  width: 100%;
}

.input-class {
  width: 100%;
}

.form-input {
  width: 100%;
  border: 2px solid black;
  justify-self: center;
  padding: 0.5rem;
  border-radius: 5px;
}

.p-card {
  width: 100%;
}

.content {
  width: 100%;
  max-width: 1000px; /* Optional: constrain max width for readability */
  margin: 0 auto;
  justify-items: center;
  justify-content: center;
  align-items: center;
}

::v-deep(.p-card-title) {
  font-size: 2.5rem;
}

::v-deep(.p-card-body) {
  justify-content: center;
  justify-items: center;
  width: 70%;
}

::v-deep(.p-card-content) {
  justify-content: center;
  text-align: center;
  width: 100%;
}

::v-deep(.p-card-footer) {
  justify-content: center;
  text-align: center;
}

::v-deep(.p-password) {
  width: 100%;
}

::v-deep(.p-password-input) {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

::v-deep(.p-button:hover) {
  border: 2px solid black;
}

.p-card {
  background: #F4F5F7;
  border: 2px solid transparent;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  color: black;
  text-align: left;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  align-items: center;
  justify-content: center;
  width: 100%;
}

.form-button {
  background-color: transparent;
  color: var(--color-blue);
  border: 2px solid var(--color-blue);
  width: 170px;
  height: 40px;
  border-radius: 15px;
  font-size: 20px;
  text-align: center;
  justify-content: center;
  margin-top: 0.5rem;
}

</style>