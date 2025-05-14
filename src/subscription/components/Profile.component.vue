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
    const valueA = ref('');
    const valueB = ref('');
    const valueC = ref('');
    const valueD = ref('');

    return {
      options1,
      options2,
      options3,
      options4,
      value1,
      value2,
      value3,
      value4,
      valueA,
      valueB,
      valueC,
      valueD,
    };
  },

  data() {
    return {
      info: [],
      user: {
        id: '',
        display: 'Loading...',
        username: 'loading',
        email: 'loading@example.com',
        icon: '',
        password: 'Loading...',
        phrase: 'Loading...',
        order: '000000',
        orderstatus: 'pending',
        subscription: 'false',
      }
    };
  },
  methods: {

    showSuccess() {
      try {
        this.$refs.toast.add({
          severity: 'success',
          summary: this.$t('update-success'),
          detail: this.$t('update-success-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    showFailFill() {
      try {
        this.$refs.toast.add({
          severity: 'error',
          summary: this.$t('update-fill-fail'),
          detail: this.$t('update-fill-fail-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    showFailPassword() {
      try {
        this.$refs.toast.add({
          severity: 'error',
          summary: this.$t('update-password-fail'),
          detail: this.$t('update-password-fail-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    showFailConfirm() {
      try {
        this.$refs.toast.add({
          severity: 'error',
          summary: this.$t('update-confirm-fail'),
          detail: this.$t('update-confirm-fail-details'),
          life: 3000
        });
      } catch (error) {
        console.error("Error adding toast:", error);
      }
    },

    async InvocaAPI() {
      const service = new UserApiService();

      try {
        const data = await service.getUsers();
        this.info = data;
        console.log("All users:", this.info);

        const loggedInUserId = await this.getLoggedInUserId();

        if (loggedInUserId) {
          this.user = this.info.find(user => String(user.id) === String(loggedInUserId));
          console.log("Matched user:", this.user);
        } else {
          console.warn("No logged-in user found.");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    },

    async getLoggedInUserId() {
      try {
        const response = await axios.get('http://localhost:3000/userlogin');
        const loginEntries = response.data;

        if (loginEntries.length > 0) {
          const loggedInUserId = loginEntries[0].id;
          console.log("Logged in user ID:", loggedInUserId);
          return loggedInUserId;
        } else {
          console.warn("No user is currently logged in.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error);
        return null;
      }
    },

    goToLogin() {
      this.$router.push('/login');
    },

    async changePassword(currentPassword, newPassword, confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        this.showFailFill();
        console.warn('All password fields must be filled.');
        return;
      }

      const service = new UserApiService();
      const freshUser = await service.getUserById(this.user.id);
      this.user = freshUser;

      if (currentPassword !== this.user.password) {
        console.warn('Current password is incorrect.');
        this.showFailPassword();
        return;
      }

      if (newPassword !== confirmPassword) {
        this.showFailConfirm();
        return;
      }

      try {
        await service.updateUser({
          ...this.user,
          password: newPassword
        });

        this.showSuccess();
        this.goToLogin();
      } catch (error) {
        console.error('Failed to update password:', error);
      }
    },

    async deleteAccount() {
      const service = new UserApiService();
      this.goToLogin();

      try {
        await service.deleteUser(this.user.id);

        await this.clearLogin();

        this.$refs.toast.add({
          severity: 'success',
          summary: this.$t('account-deleted'),
          detail: this.$t('account-deleted-details'),
          life: 3000
        });
      } catch (error) {
        console.error('Failed to delete account:', error);

        this.$refs.toast.add({
          severity: 'error',
          summary: this.$t('account-delete-fail'),
          detail: this.$t('account-delete-fail-details'),
          life: 3000
        });
      }
    }
  },
  mounted() {
    this.InvocaAPI();
  }
}
</script>


<template>
  <div class="profile">
    <div class="account__profile-details">
      <pv-image :src="user.icon" alt="Foto de perfil" width="100%" height="auto" class="pfp"></pv-image>
      <div class="account__profile-text">
        <p class="account__profile-display-name">{{ user.display }}</p>
        <p class="account__profile-username">@{{ user.username }}</p>
        <p class="account__profile-email">{{ user.email }}</p>
      </div>
    </div>

    <div class="profile__info">
      <div class="profile__info-half">
        <pv-card>
          <template #title>{{ $t('profile') }}</template>
          <template #content>
            <p v-if="user.phrase !== ''">"{{ user.phrase }}"</p>
            <p v-if="user.phrase === ''">{{ $t('no-phrase') }} </p>
          </template>
        </pv-card>
      </div>

      <div class="profile__info-half">
        <pv-card>
          <template #title>{{ $t('recent-orders') }}</template>
          <template #content>
            <div class="same-line">
              <p v-if="user.order !== ''">{{ $t('order') }} #{{ user.order }}</p>
              <p v-if="user.order === ''">{{ $t('no-order') }}</p>
              <div>
                <pv-message v-if="user.orderstatus === 'pending'" class="flex flex-wrap gap-4 justify-center align-center" severity="warn">{{ $t('pending') }}</pv-message>
                <pv-message v-if="user.orderstatus === 'delivered'" class="flex flex-wrap gap-4 justify-center align-center" severity="success">{{ $t('delivered') }}</pv-message>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

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
            <pv-toast ref="toast"  position="top-right" style="margin-top: 2rem" />
            <pv-button class="buttonn" @click="changePassword(valueA, valueB, valueC)" severity="warn">{{ $t('change')}}</pv-button>
          </div>
          <div class="same-line">
            <p>{{ $t('passinput')}}</p>
            <pv-password v-model="valueA" class="pas" :feedback="false" />
          </div>
          <div class="same-line">
            <p>{{ $t('setting.new-password')}}</p>
            <pv-password v-model="valueB" class="pas" :feedback="false" />
          </div>
          <div class="same-line">
            <p>{{ $t('confpass')}}</p>
            <pv-password v-model="valueC" class="pas" :feedback="false" />
          </div>
          <div class="set-options">
            <div class="buton">
              <pv-button @click="deleteAccount()" class="but-set delete" severity="danger">{{ $t('delete1')}}</pv-button>
            </div>
            <div class="butons">
              <pv-button @click="goToLogin()" class="but-set logout" severity="warn">{{ $t('logout')}}</pv-button>
              <pv-button class="but-set save" severity="success">{{ $t('save')}}</pv-button>
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
  font-size: 20px;
  text-align: left;
  margin-bottom: 0;
}

.account__profile-email {
  margin-top:0;
  color: var(--color-blue);
  font-size: 20px;
  text-align: left;
}

.account__profile-details {
  width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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

.buttonn {
  background-color: transparent;
  color: var(--color-blue);
  border: 2px solid var(--color-blue);
  width: 100px;
  height: 40px;
  border-radius: 15px;
}

::v-deep(.p-selectbutton) {
  gap: 10px;
}

::v-deep(.p-togglebutton) {
  background-color: transparent;
  color: #2364A0;
  border-color: #2364A0;
  width: 80px;
  height: 40px;
  font-weight: normal;
}

::v-deep(.p-togglebutton.p-togglebutton-checked) {
  color: white;
  background-color: var(--color-accent-orange);
  width: 80px;
  height: 40px;
}

::v-deep(.p-togglebutton-checked .p-togglebutton-content) {
  background: var(--color-accent-orange);
}

::v-deep(.p-togglebutton:hover) {
  background: var(--color-accent-orange);
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

.delete {
  background-color: var(--color-accent-orange);
  color: white;
  width: 170px;
  height: 50px;
  border-radius: 15px;
}

.logout {
  background-color: var(--color-accent-light-yellow);
  color: black;
  width: 150px;
  height: 50px;
  border-radius: 15px;
}

.save {
  background-color: var(--color-blue);
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

::v-deep(.p-message-text) {
  color: black;
  text-align: center;
}

::v-deep(.p-message-content) {
  text-align: center;
  justify-content: center;
  justify-items: center;
}

.warn {
  background-color: var(--color-accent-light-yellow);
  width: 100px;
  height: 50px;
  border-radius: 15px;
  border-color: transparent;
}

.success {
  background-color: var(--color-blue);
  width: 100px;
  height: 50px;
  border-radius: 15px;
  border-color: transparent;
  text-align: center;
  justify-content: center;
}

</style>