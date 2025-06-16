<script>

import LanguageSwitcher from "../../public/components/language-switcher.component.vue";

export default {
  name: "Admin-Access",
  components: {
    LanguageSwitcher,
  },
  data() {
    return {
      value1: '',
      value2: ''
    }
  },
  methods: {
    goBack() {
      this.$router.push('/login');
    }
  }
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
        <template #title>{{ $t('admin-access')}}</template>
        <template #content>

          <!-- aca quiero intentar lo de mandar el security pin por sms-->
          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('phoneinput')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text v-model="value1" class="form-input" aria-label="Phone input"/>
            </div>
          </div>

          <div class="form-group">
            <div class="label-class">
              <label class="form-label">{{ $t('security-pin')}}</label>
            </div>

            <div class="input-class">
              <pv-input-text v-model="value2" class="form-input" aria-label="User input"/>
            </div>

            <div class="link-class">
              <a href="" class="forgot-password" aria-label="Forgot password">{{ $t('send-again')}}</a>
            </div>
          </div>
        </template>

        <template #footer>
          <pv-toast ref="toast"  position="top-right" style="margin-top: 2rem" />
          <pv-button @click="" class="form-button" aria-label="Login button">{{ $t('login')}}</pv-button>
        </template>
      </pv-card>
      <div class="division">{{ $t('or')}}</div>
      <pv-card>
        <template #content class="ext-buttons">
          <div>
            <p style="text-align: center">{{ $t("createacc")}}</p>
            <pv-button @click="goBack()" class="justify-center external"  :label="$t('return')" iconPos="left" aria-label="Register button"/>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style>

</style>