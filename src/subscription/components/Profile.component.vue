<script>
import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { UserApiService } from "../service/user-api.service.js";


export default {
  setup() {
    const {t, locale} = useI18n();

    const options1 = computed(() => [
      { name: t('yes'), value: 1 },
      { name: t('no'), value: 0 }
    ]);

    const options2 = computed(() => [
      { name: t('yes'), value: 1 },
      { name: t('no'), value: 0 }
    ]);

    const options3 = computed(() => [
      { name: t('yes'), value: 1 },
      { name: t('no'), value: 0 }
    ]);

    const options4 = computed(() => [
      { name: t('public'), value: 1 },
      { name: t('private'), value: 0 }
    ]);

    const value1 = ref(options1.value[0]);
    const value2 = ref(options2.value[0]);
    const value3 = ref(options3.value[0]);
    const value4 = ref(options4.value[0]);

    return {
      options1,
      options2,
      options3,
      options4,
      value1,
      value2,
      value3,
      value4
    };
  },

  data() {
    return {
      info: [],
      kingTurkey: {
        id: '',
        display: 'Loading...',
        username: '@loading',
        email: 'loading@example.com',
        icon: '',
        password: 'Loading...',
        phrase: 'Loading...'
      }
    };
  },
  methods: {
    InvocaAPI() {
      const service = new UserApiService()
      service.getUsers().then(data => {
        this.info = data
        console.log(this.info)

        this.kingTurkey = this.info.find(user => user.id === "1");
        console.log(this.kingTurkey);
      })
    }
  },
  mounted() {
    this.InvocaAPI();
  }
}
</script>


<template>
  <div class="profile">
    <!-- Left Panel -->
    <div class="account__profile-details">
      <div>
        <pv-image :src="kingTurkey.icon" alt="Foto de perfil" width="200" height="200" class="pfp"></pv-image>
        <div>
          <p class="account__profile-display-name">{{ kingTurkey.display }}</p>
          <p class="account__profile-username">{{ kingTurkey.username }}</p>
          <p class="account__profile-email">{{ kingTurkey.email }}</p>
        </div>
      </div>
    </div>

    <!-- Middle Panel -->
    <div class="profile__info">
      <div class="profile__info-half">
        <pv-card>
          <template #title>{{ $t('profile') }}</template>
          <template #content>
            <p>{{ kingTurkey.phrase }}</p>
          </template>
        </pv-card>
      </div>
      <div class="profile__info-half">
        <pv-card>
          <template #title>{{ $t('recent-orders') }}</template>
          <template #content>
            <div class="same-line">
              <p>{{ $t('order') }} #123112</p>
              <div>
                <!--<pv-message class="flex flex-wrap gap-4 justify-center align-center" severity="warn">{{ $t('pending') }}</pv-message>-->
                <pv-message class="flex flex-wrap gap-4 justify-center align-center" severity="success">{{ $t('delivered') }}</pv-message>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="profile__config">
      <pv-card>
        <template #title>{{ $t('settings') }}</template>
        <template #content>
          <div class="same-line">
            <p>{{ $t('setting.allow-not')}}</p>
            <pv-select-button v-model="value1" :default-value="value1" :options="options1" optionLabel="name"/>
          </div>
          <div class="same-line">
            <p>{{ $t('setting.not-status')}}</p>
            <pv-select-button v-model="value2" :default-value="value2" :options="options2" optionLabel="name"/>
          </div>
          <div class="same-line">
            <p>{{ $t('setting.not-email')}}</p>
            <pv-select-button v-model="value3" :default-value="value3" :options="options3" optionLabel="name"/>
          </div>
          <div class="same-line">
            <p>{{ $t('setting.visibility')}}</p>
            <pv-select-button v-model="value4" :default-value="value4" :options="options4" optionLabel="name"/>
          </div>
          <div class="same-line">
            <p>{{ $t('setting.current-password')}}</p>
            <p>*********</p>
            <button>{{ $t('change')}}</button>
          </div>
          <div class="same-line">
            <p>{{ $t('setting.new-password')}}</p>
            <pv-password class="pas" :feedback="false" toggle-mask/>
          </div>
          <div class="same-line">
            <p>{{ $t('confpass')}}</p>
            <pv-password class="pas" :feedback="false" toggle-mask/>
          </div>
          <div class="set-options">
            <div class="buton">
              <button>{{ $t('delete1')}}</button>
            </div>
            <div class="butons">
              <button>{{ $t('logout')}}</button>
              <button>{{ $t('save')}}</button>
            </div>
          </div>
        </template>
      </pv-card>
    </div>
  </div>

</template>

<style scoped>

.profile {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  gap: 3rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.p-card {
  background: var(--color-light);
  border: 2px solid transparent;
  padding: 2rem;
  height: 100%;
  border-radius: 10px;
  color: var(--color-text);
  text-align: left;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

::v-deep(.p-card-title) {
  color: var(--color-accent-orange);
  font-weight: normal;
  font-size: 1.5rem;
}

::v-deep(.p-message-text) {
  color: var(--color-text);
}

.same-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account__profile-display-name {
  color: var(--color-primary);
  font-size: 32px;
  text-align: left;
  margin-bottom: 0;
}

.account__profile-username {
  margin-top:0;
  color: var(--color-accent-yellow);
  font-size: 24px;
  text-align: left;
  margin-bottom: 0;
}

.account__profile-email {
  margin-top:0;
  color: var(--color-blue);
  font-size: 24px;
  text-align: left;
}

.account__profile-details {
  width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile__info {
  width: 20%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.profile__info-half {
  flex: 0 0 45%;
}

.profile__config {
  width: 30%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.set-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  width: 100%;
  gap: 20px;
}

::v-deep(.p-selectbutton) {
  background-color: transparent;
  color: var(--color-blue);
  border: 2px solid var(--color-blue);
  border-radius: 5px;
  width: 200px;
  height: 40px;
}

::v-deep(.p-selectbutton.p-selectbutton-checked) {
  background-color: var(--color-accent-light-yellow);
  color: var(--color-accent-orange);
}

::v-deep(.p-selectbutton-checked .p-selectbutton-content) {
  background-color:  var(--color-accent-light-yellow);
}

::v-deep(.p-selectbutton:hover) {
  background-color: var(--color-accent-orange);
  color: var(--color-background);
}

::v-deep(.p-password-input) {
  background: transparent;
  color: var(--color-text);
}


.buton {
  width: 50%;
  text-align: left;
}

.butons {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.pfp {
  color: black;
}

.pas {
  width: 200px;
  height: 40px;
  border: 2px solid var(--color-blue);
  border-radius: 10px;
  padding: 5px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  text-align: left;
  justify-items: left;
}

</style>