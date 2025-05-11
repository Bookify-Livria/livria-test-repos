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
  <div class="all">
    <h1 class="head">{{$t('account')}}</h1>
    <div class="profile">
      <div class="profile-details">
        <div>
          <pv-image :src="kingTurkey.icon" alt="Foto de perfil" width="200" height="200" class="pfp"></pv-image>
          <div>
            <p class="display-name">{{ kingTurkey.display }}</p>
            <p class="username">{{ kingTurkey.username }}</p>
            <p class="email">{{ kingTurkey.email }}</p>
          </div>
        </div>
      </div>

      <div class="profile-info">

        <pv-card>
          <template #title>{{ $t('profile') }}</template>
          <template #content>
            <p>{{ kingTurkey.phrase }}</p>
          </template>
        </pv-card>

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

      <div class="profile-config">
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
              <pv-button class="buttonn" severity="warn">{{ $t('change')}}</pv-button>
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
                <pv-button class="but-set delete" severity="danger">{{ $t('delete1')}}</pv-button>
              </div>
              <div class="butons">
                <pv-button class="but-set logout" severity="warn">{{ $t('logout')}}</pv-button>
                <pv-button class="but-set save" severity="success">{{ $t('save')}}</pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>

.head {
  color: #063A5D;
  left: 0;
  text-align: left;
  margin-left: 2%;
  font-weight: lighter;
  letter-spacing: 10px;
  width: 100%;
}

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

.profile {
  display: flex;
  align-items: center;
  justify-content: space-around;
  justify-items: center;
  width: 100%;
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
}

::v-deep(.p-card-title) {
  color: #FF5C00;
  font-weight: normal;
  font-size: 1.5rem;
}

::v-deep(.p-message-text) {
  color: black;
}

.same-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.display-name {
  color: #063A5D;
  font-size: 32px;
  text-align: left;
  margin-bottom: 0;
}

.username {
  margin-top:0;
  color: #FEB913;
  font-size: 24px;
  text-align: left;
  margin-bottom: 0;
}

.email {
  margin-top:0;
  color: #2364A0;
  font-size: 24px;
  text-align: left;
}

.profile-details {
  width: 15%;
  display: inline-block;
  align-items: center;
  justify-content: center;
}

.profile-info {
  width: 35%;
}

.profile-config {
  width: 35%;
}

.set-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  width: 100%;
  gap: 20px;
}

::v-deep(.p-togglebutton) {
  background-color: transparent;
  color: #2364A0;
  border-color: #2364A0;
  width: 70px;
  height: 40px;
}

::v-deep(.p-togglebutton.p-togglebutton-checked) {
  color: orange;
  background-color: orangered;
  width: 70px;
  height: 40px;
}

::v-deep(.p-togglebutton-checked .p-togglebutton-content) {
  background: orangered;
}

::v-deep(.p-togglebutton:hover) {
  background: orangered;
}

::v-deep(.p-password-input) {
  background: white;
  color: black;
}

.buttonn {
  background-color: transparent;
  color: #2364A0;
  border: 2px solid #2364A0;
  width: 100px;
  height: 40px;
  border-radius: 15px;
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

.delete {
  background-color: red;
  color: white;
  width: 150px;
  height: 50px;
  border-radius: 15px;
}

.logout {
  background-color: orangered;
  color: white;
  width: 150px;
  height: 50px;
  border-radius: 15px;
}

.save {
  background-color: darkgreen;
  color: white;
  width: 150px;
  height: 50px;
  border-radius: 15px;
}

.pas {
  width: 200px;
  height: 40px;
  border: 2px solid #2364A0;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  text-align: left;
  justify-items: left;
}

</style>