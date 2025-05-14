<script>
import toolbarComponent from "../components/toolbar.component.vue";
import footerComponent from "../components/footer-content.component.vue";
import CommunityDetail from '../../communities/components/community-detail.component.vue';


export default {
  name: "home.component",
  components: {
    toolbarComponent,
    footerComponent,
    CommunityDetail,
  }
}
</script>

<template>
  <!-- Header -->
  <toolbarComponent/>

  <div class="community-container">

    <div class="community__fullwidth">
      <!-- Singular Community -->
      <CommunityDetail />
    </div>
  </div>
</template>

<style scoped>
.community-container {
  margin: 7.5rem calc(-1 * ((100vw - 100%) / 2)) 0;
}

.community__fullwidth {
  padding: 0 2rem 0 0;
  margin-bottom: 4rem;
}

.cards__container p {
  margin: 0 0 3rem;
}

</style>