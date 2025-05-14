<script>
import axios from 'axios';

import { ref } from 'vue';
import 'primeicons/primeicons.css';
import LanguageSwitcher from "../../public/components/language-switcher.component.vue";

const value1 = '';
const value2 = '';

export default {
  name: "Login",
  components: {
    LanguageSwitcher,
  },
  methods: {
    async clearLogin() {
      try {
        const response = await axios.get('http://localhost:3000/userlogin');
        const users = response.data;

        await Promise.all(users.map(user =>
            axios.delete(`http://localhost:3000/userlogin/${user.id}`)
        ));

        console.log("Cleared login.");
      } catch (error) {
        console.error("Error clearing login:", error);
      }
    },

    async createLogin(userId, valueA, valueB) {
      const newUser = {
        id: userId,
        username: valueA,
        password: valueB
      };

      try {
        const response = await axios.post('http://localhost:3000/userlogin', newUser);
        console.log("Login session created:", response.data);
      } catch (error) {
        console.error("Error creating login session:", error);
      }
    },

    async validateLogin(valueA, valueB) {
      try {
        const response = await axios.get('http://localhost:3000/users');
        const users = response.data;

        const matchedUser = users.find(
            user => user.user === valueA && user.password === valueB
        );

        if (matchedUser) {
          console.log("Login successful:", matchedUser.display);
          return matchedUser;
        } else {
          console.warn("Login failed: invalid credentials.");
          return null;
        }

      } catch (error) {
        console.error("Error validating login:", error);
        return null;
      }
    },

    goToHome() {
      this.$router.push('/home');
    },

    goToRegister() {
      this.$router.push('/register');
    },


    async handleLogin(valueA, valueB) {
      const matchedUser = await this.validateLogin(valueA, valueB);
      if (matchedUser && valueA!=='' && valueB!=='') {
        await this.createLogin(matchedUser.id, valueA, valueB);
        this.showLogin();
        this.goToHome();
      } else {
        this.showFail();
      }
    },

    showLogin() {
      try {
        this.$refs.toast.add({
          severity: 'success',
          summary: this.$t('login-success'),
          detail: this.$t('login-success-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    showFail() {
      try {
        this.$refs.toast.add({
          severity: 'error',
          summary: this.$t('login-fail'),
          detail: this.$t('login-fail-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    }
  },

  mounted() {
    this.clearLogin();
  },
}
</script>

<template>
  <div class="all">
    <div class="head">
      <div class="same-line">
        <img src="../../assets/images/logo/logo.png" alt="Logo" height="60px">
      </div>
        <language-switcher />
    </div>
    <div class="content">
      <pv-card>
        <template #title>{{ $t('login')}}</template>
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
              <label class="form-label">{{ $t('passinput')}}</label>
            </div>

            <div class="input-class">
              <pv-password v-model="value2" class="form-input" :feedback="false" />
            </div>

            <div class="link-class">
              <a href="" class="forgot-password">{{ $t('passforg')}}</a>
            </div>
          </div>
        </template>

        <template #footer>
          <pv-toast ref="toast"  position="top-right" style="margin-top: 2rem" />
          <pv-button @click="handleLogin(value1, value2)" class="form-button">{{ $t('login')}}</pv-button>
        </template>
      </pv-card>
      <div class="division">{{ $t('or')}}</div>
      <pv-card>
        <template #content class="ext-buttons">
          <div>
            <p style="text-align: center">{{ $t("createacc")}}</p>
            <pv-button @click="goToRegister()" class="justify-center external"  :label="$t('register')" iconPos="left" />
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>

.all {
  display: block;
  justify-content: space-around;
  justify-items: center;
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
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 40px;
  font-weight: 600;
  color: var(--color-blue);
  margin: 0;
}

.same-line {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem;
}

.head {
  display: flex;
  justify-items: center;
  justify-content: flex-end;
  gap: 20rem;
  color: var(--color-text);
  width: 100%;
  padding-right: 27%;
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

.link-class {
  justify-content: right;
  justify-items: right;
  text-align: right;
  width: 100%;
  margin-top: 2rem;
}

.form-input {
  width: 100%;
  border: 2px solid var(--color-text);
  justify-self: center;
  padding: 0.5rem;
  border-radius: 5px;
}

.forgot-password {
  color: var(--color-blue);
}

.content {
  width: 50%;
  justify-items: center;
  justify-content: center;
  align-items: center;
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

.division {
  margin-top: 20px;
  margin-bottom: 20px;
  color: var(--color-text);
  font-size: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  &::before,
  &::after {
    content: '';
    display: block;
    height: 0.09em;
    min-width: 30vw;
  }

  &::before {
    background: linear-gradient(to right, rgba(240,240,240,0), var(--color-text));
    margin-right: 4vh;
  }

  &::after {
    background: linear-gradient(to left, rgba(240,240,240,0), var(--color-text));
    margin-left: 4vh;

  }
}

.ext-buttons {
  display: block;
  width: 50%;
}

.form-button,
.external {
  background-color: transparent;
  color: var(--color-blue);
  border: 2px solid var(--color-blue);
  width: 200px;
  height: 60px;
  border-radius: 15px;
  font-size: 20px;
  text-align: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.p-card {
  border: 2px solid transparent;
  padding: 3rem 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  color: var(--color-text);
  text-align: left;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  align-items: center;
  justify-content: center;
  background-color: rgba(var(--color-secondary-rgb), 0.15);
  width: 100%;
}


</style>