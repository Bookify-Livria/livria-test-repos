<script>
import axios from 'axios';

import { ref } from 'vue';
import 'primeicons/primeicons.css';

const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(null);
const check = false;

const initialValues = ref({
  username: '',
  email: ''
});

export default {
  name: "Register"
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
              <label class="form-label">{{ $t('emailinput')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text inputmode="email" v-model="value2" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('passinput')}}</label>
            </div>

            <div class="input-class">
              <pv-password v-model="value3" class="form-input"/>
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('confpass')}}</label>
            </div>

            <div class="input-class">
              <pv-password v-model="value4" class="form-input"/>
            </div>
          </div>
        </template>

        <template #footer>
          <pv-button type="submit" @click="" class="form-button">{{ $t('register')}}</pv-button>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>

.all {
  display: block;
  position: absolute;
  background: white;
  justify-content: space-around;
  justify-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  margin-bottom: 0;
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

.help-class {
  justify-content: right;
  justify-items: right;
  text-align: right;
  width: 100%;
}

.form-input {
  width: 100%;
  border: 2px solid black;
  justify-self: center;
  padding: 0.5rem;
  border-radius: 5px;
}

.forgot-password {
  color: cyan;
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

.content {
  width: 20%;
  justify-items: center;
  justify-content: center;
  align-items: center;
}

.form-button {
  font-size: 20px;
  text-align: center;
  justify-content: right;
}

::v-deep(.p-card-title) {
  font-size: 2.5rem;
}

::v-deep(.p-card-content) {
  justify-content: center;
  justify-items: center;
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

.p-error {
  color: red;
}

::v-deep(.p-card-title) {
  text-align: center;
  margin-bottom: 0.5rem;
}

.form-button {
  background-color: transparent;
  color: #2364A0;
  border: 2px solid #2364A0;
  width: 100px;
  height: 40px;
  border-radius: 15px;
  font-size: 20px;
  text-align: center;
  justify-content: center;
  margin-top: 0.5rem;
}

</style>