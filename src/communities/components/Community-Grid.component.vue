<script>
import Card from 'primevue/card'
import Button from 'primevue/button'
import CreateCommunity from './Create.Community.component.vue'
import { CommunityApiService } from '../service/community-api.service'

export default {
  name: 'CommunityGrid',
  components: {
    Card,
    Button,
    CreateCommunity
  },
  data() {
    return {
      communities: [],
      showForm: false
    }
  },
  mounted() {
    this.fetchCommunities()
  },
  methods: {
    fetchCommunities() {
      const service = new CommunityApiService()
      service.getCommunities().then(data => {
        this.communities = data
      })
    },
    showCreateForm() {
      this.showForm = true
    },
    hideCreateForm() {
      this.showForm = false
    },
    handleCommunityCreated(newCommunity) {
      this.communities.push(newCommunity)
      this.hideCreateForm()
    }
  }
}
</script>

<template>
  <div class="community-grid">
    <div class="custom-card-wrapper">
      <pv-card class="create-card">
        <template #content>
          <div class="create-content">
            <div class="plus-box" @click="showCreateForm">
              <span class="plus-sign">+</span>
            </div>
            <p class="create-text">{{ $t('create-community')}}</p>
          </div>
        </template>
      </pv-card>
    </div>

    <div v-for="community in communities" :key="community.id" class="custom-card-wrapper">
      <pv-card>
        <template #header>
          <img :src="community.image" :alt="community.name" class="community-cover" />
        </template>
        <template #title>
          <div class="community-title">{{ community.name }}</div>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <pv-button :label="$t('see-more')" class="p-button-sm" />
          </div>
        </template>
      </pv-card>
    </div>

    <CreateCommunity v-if="showForm" @close="hideCreateForm" @created="handleCommunityCreated" />
  </div>
</template>

<style scoped>
.community-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  padding: 0;
}

.custom-card-wrapper {
  width: 260px;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.community-cover {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.community-title {
  font-size: 1.1rem;
  font-weight: bold;
  text-align: left;
  margin-top: 0.75rem;
  color: #333;
  text-align: center;
}

.create-card {
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  height: 100%;
}

.create-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.plus-box {
  width: 220px;
  height: 220px;
  border: 1px solid #b2ebf2;
  background-color: #e0f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.plus-box:hover {
  background-color: #b2ebf2;
}

.plus-sign {
  font-size: 48px;
  color: #81d4fa;
  line-height: 1;
}

.create-text {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1rem;
  color: #f4511e;
  text-transform: uppercase;
}


</style>
