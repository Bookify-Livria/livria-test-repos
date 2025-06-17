<script>
import LanguageSwitcher from "../../public/components/language-switcher.component.vue";
import { UserApiService } from "../service/user-api.service.js";

export default {
  name: "Admin-Access",
  components: {
    LanguageSwitcher,
  },
  data() {
    return {
      pin: '',
      password: '',
    }
  },
  methods: {
    goBack() {
      this.$router.push('/login');
    },
    goAdminPage() {
      this.$router.push('/dashboard');
    },
    async validateLogin(valueA, valueB) {
      try {
        const response = new UserApiService();
        const admin = await response.getAdminUser();

        const matchedAdmin = admin.password === valueA && admin.securityPin === valueB ? admin : null;

        if (matchedAdmin) {
          console.log("Login successful:", matchedAdmin.display);
          this.goAdminPage();
        } else {
          console.warn("Login failed: invalid credentials.");
        }
      } catch (error) {
        console.error("Error validating login:", error);
      }
    }
  },
  mounted() {
  },

}
</script>

<template>
  <div class="all">
    <div class="head">
      <img src="../../assets/images/logo/logo.png" alt="Logo" height="45px">
      <language-switcher />
    </div>
    <div class="content">
      <pv-card>
        <template #title>{{ $t('admin-access')}}</template>
        <template #content>
          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('confpass') }}</label>
            </div>

            <div class="input-class">
              <pv-password v-model="password" :feedback="false" class="form-input" aria-label="Confirm password input"/>
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('security-pin')}}</label>
            </div>

            <div class="otp-input-class">
              <pv-otp v-model="pin" integerOnly/>
            </div>
          </div>
        </template>

        <template #footer>
          <pv-toast ref="toast"  position="top-right" style="margin-top: 2rem" />
          <div class="same-line">
            <pv-button @click="goBack()" class="form-button">{{ $t('go-back') }}</pv-button>
            <pv-button @click="validateLogin(password, pin)" class="form-button" aria-label="Login button">{{ $t('login') }}</pv-button>
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
  font-size: 36px;
  font-weight: 600;
  color: var(--color-blue);
  margin-bottom: 1rem;
}

.head {
  display: flex;
  justify-items: center;
  justify-content: space-around;
  width: 100%;
  padding: 2rem 8rem;
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
  font-size: 1rem;
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
  margin-bottom: 1rem;
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
  width: 75%;
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

.form-button {
  background-color: transparent;
  color: var(--color-blue);
  border: 2px solid var(--color-blue);
  width: 175px;
  height: 50px;
  border-radius: 15px;
  font-size: 18px;
  text-align: center;
  justify-content: center;
}

.p-card {
  border: 2px solid transparent;
  padding: 2.5rem;
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

.half-width {
  width: 50%;
}

.otp-input-class {
  width: 100%;
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
}

.p-inputotp {
  gap: 0.5rem;
}

::v-deep( .p-inputotp-input ) {
  text-align: center;
  border: 2px solid var(--color-text);
  border-radius: 5px;
  width: 100%;
  padding: 0.5rem;
}

.same-line {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-top: 1rem;
}

</style>