<template>
  <div class="mobile-page-base">
    <div class="container">
      <h2 class="section-title">{{ t("SettingsView.section_title") }}</h2>

      <div class="form">
        <div class="row">
          <label>{{  t("SettingsView.email")  }}</label>
          <div class="readonly-field">{{ email }}</div>
        </div>

        <div class="row">
          <label>{{  t("SettingsView.nickname")  }}</label>
          <input class="input" type="text" v-model="nickname" placeholder="Your nickname" />
        </div>

        <div class="row">
          <label>{{  t("SettingsView.bio")  }}</label>
          <textarea class="textarea" v-model="bio" placeholder="Write something about yourself..."></textarea>
        </div>

        <!-- <div class="row">
          <label>Avatar URL</label>
          <input class="input" type="text" v-model="avatarUrl" placeholder="Image URL (optional)" />
        </div>

        <div v-if="avatarUrl" class="avatar-preview">
          <img :src="avatarUrl" alt="avatar" />
        </div> -->

        <button class="big-button" @click="saveProfile">{{  t("SettingsView.save")  }}</button>
        <button class="big-button logout-button" @click="logout">{{  t("SettingsView.logout")  }}</button>
      </div>
    </div>

    <div style="height: 50px;"></div>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '../components/TabBar.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const email = ref('')
const nickname = ref('')
const bio = ref('')
const avatarUrl = ref('')
const uuid = ref('')

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/')

  try {
    // 先解開 token 拿 uuid
    const payload = JSON.parse(atob(token.split('.')[1]))
    uuid.value = payload.userUuid

    const res = await fetch(`${API_URL}/users/${uuid.value}`)
    const data = await res.json()
    nickname.value = data.nickname || ''
    bio.value = data.bio || ''
    avatarUrl.value = data.avatarUrl || ''

    const account = await fetch(`${API_URL}/accounts/by-uuid/${uuid.value}`)
    const accountData = await account.json()
    email.value = accountData.email

  } catch (err) {
    console.error('Failed to load profile', err)
  }
})

async function saveProfile() {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`${API_URL}/users/${uuid.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nickname: nickname.value,
        bio: bio.value,
        avatarUrl: avatarUrl.value
      })
    })
    if (!res.ok) throw new Error('Update failed')
    alert('Profile updated!')
  } catch (err) {
    console.error(err)
    alert('Update failed.')
  }
}

function logout() {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped lang="scss">


.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.readonly-field {
  font-size: 16px;
  color: #555;
}

.input,
.textarea {
  padding: 0.6rem 0.8rem;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-accent);
  color: var(--color-text);
  font-family: 'Source Serif Pro', serif;
}

.textarea {
  resize: none;
}

.avatar-preview {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100px;
    border-radius: 50%;
    border: 2px solid #ccc;
  }
}


.logout-button {
  background-color: var(--color-danger) !important;
  }
</style>
