<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import Profile from "../../users/components/Profile.component.vue";

export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    Profile,
  }
}

</script>


<template>
  <!-- Header -->
  <toolbarComponent/>

    <!-- Title -->
    <div class="title__container">
      <h1 class="h1__title">{{$t('account')}}</h1>
    </div>


    <!-- Profile -->
      <div class="profile__container">
        <Profile/>
      </div>

    <!-- Footer -->
    <div class="footer__container-fullwidth">
      <footerComponent/>
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