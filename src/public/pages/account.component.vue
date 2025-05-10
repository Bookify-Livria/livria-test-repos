<script>
import axios from 'axios';
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";

export default {
  name: "account.component",
  components: {
    toolbarComponent,
    footerComponent,
  },
  data() {
    return {
      value1: 'Yes',
      value2: 'Yes',
      value3: 'Yes',
      value4: 'Public',
      options1: [
        { name: 'Yes', value: 1 },
        { name: 'No', value: 0 }
      ],
      options2: [
        { name: 'Yes', value: 1 },
        { name: 'No', value: 0 }
      ],
      options3: [
        { name: 'Yes', value: 1 },
        { name: 'No', value: 0 }
      ],
      options4: [
        { name: 'Public', value: 1 },
        { name: 'Private', value: 0 }
      ],
      info: null,
      kingTurkey: {
        id: '',
        display: 'Loading...',
        user: '@loading',
        email: 'loading@example.com',
        icon: 'https://via.placeholder.com/150',
        password: '',
        phrase: ''
      }
    };
  },
  methods: {
    InvocaAPI() {
      axios.get('http://localhost:3000/users')
          .then(response => {
            this.info = response.data;
            console.log(this.info);
            this.kingTurkey = this.info.find(user => user.id === "1");
            console.log(this.kingTurkey);
          })
          .catch(error => {
            console.error("Error fetching data.", error);
          });
    }
  },
  mounted() {
    this.InvocaAPI();
  }
}
</script>


<template>
  <!-- Header -->
  <toolbarComponent/>

  <div class="account-container">
    <!-- Title -->
    <div class="title__container">
      <h1 class="h1__title">{{$t('account')}}</h1>
    </div>

    <div class="account__profile">

    <!-- Left Panel -->
      <div class="account__profile-details">
        <div>
          <pv-image :src="kingTurkey.icon" alt="Foto de perfil" width="200" height="200" class="pfp"></pv-image>
          <div>
            <p class="account__profile-display-name">{{ kingTurkey.display }}</p>
            <p class="account__profile-username">{{ kingTurkey.user }}</p>
            <p class="account__profile-email">{{ kingTurkey.email }}</p>
          </div>
        </div>
      </div>

      <!-- Middle Panel -->
      <div class="account__profile-info">
        <div class="account__profile-info-half">
          <pv-card>
            <template #title>{{ $t('profile') }}</template>
            <template #content>
              <p>{{ kingTurkey.phrase }}</p>
            </template>
          </pv-card>
        </div>
        <div class="account__profile-info-half">
          <pv-card>
            <template #title>{{ $t('recent-orders') }}</template>
            <template #content>
              <div class="same-line">
                <p>Order #123112</p>
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
      <div class="account__profile-config">
        <pv-card>
          <template #title>{{ $t('settings') }}</template>
          <template #content>
            <div class="same-line">
              <p>{{ $t('setting.allow-not')}}</p>
              <pv-select-button v-model="value1" model-value="1" :options="options1" optionLabel="name"/>
            </div>
            <div class="same-line">
              <p>{{ $t('setting.not-status')}}</p>
              <pv-select-button v-model="value2" model-value="1" :options="options2" optionLabel="name"/>
            </div>
            <div class="same-line">
              <p>{{ $t('setting.not-email')}}</p>
              <pv-select-button v-model="value3" model-value="1" :options="options3" optionLabel="name"/>
            </div>

            <div class="same-line">
              <p>{{ $t('setting.visibility')}}</p>
              <pv-select-button v-model="value4" model-value="1" :options="options4" optionLabel="name"/>
            </div>
            <div class="same-line">
              <p>{{ $t('setting.current-password')}}</p>
              <p>*********</p>
              <pv-button severity="warn">{{ $t('change')}}</pv-button>
            </div>
            <div class="same-line">
              <p>{{ $t('setting.new-password')}}</p>
              <pv-password :feedback="false"/>
            </div>
            <div class="same-line">
              <p>{{ $t('setting.new-password')}}</p>
              <pv-password :feedback="false"/>
            </div>
            <div class="change-password">
              <pv-button severity="success">{{ $t('save')}}</pv-button>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent/>
    </div>
  </div>

</template>

<style scoped>

.account-container {
  display: block;
  position: absolute;
  justify-content: space-around;
  justify-items: center;
  width: 100%;
  height: 100%;
  top: 9.5rem;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  margin-bottom: 0;
  padding: 0 2rem;
}

.account__profile {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  justify-items: center;
  width: 100%;
  gap: 3rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.p-card {
  background: var(--color-light);
  border: 2px solid transparent;
  padding: 2rem;
  border-radius: 10px;
  color: var(--color-text);
  text-align: left;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  height: 100%;
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
  display: inline-block;
  align-items: center;
  justify-content: center;
}

.account__profile-info {
  width: 35%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.account__profile-info-half {
  flex: 0 0 45%;
}

.account__profile-config {
  width: 35%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.change-password {
  align-items: center;
  right: 0;
  text-align: right;
  padding-top: 1.5rem;
}

::v-deep(.p-togglebutton) {
  background-color: transparent;
  color: var(--color-blue);
  border-color: var(--color-blue);
}

::v-deep(.p-togglebutton.p-togglebutton-checked) {
  color: orange;
  background-color: orangered;
}

::v-deep(.p-togglebutton-checked .p-togglebutton-content) {
  background: orangered;
}

::v-deep(.p-password-input) {
  background: white;
  color: black;
}

.p-button {
  background-color: transparent;
  color: var(--color-blue);
  border-color: var(--color-blue);
}

.pfp {
  color: black;
}

</style>