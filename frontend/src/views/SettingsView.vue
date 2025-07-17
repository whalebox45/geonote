<template>
  <div class="mobile-page-base">
    <div class="container">
      <h2 class="section-title">{{ t("SettingsView.section_title") }}</h2>

      <div class="form">
        <div class="row">
          <label>{{ t("SettingsView.email") }}</label>
          <div class="readonly-field">{{ email }}</div>
        </div>

        <div class="row">
          <label>{{ t("SettingsView.nickname") }}</label>
          <input class="input" type="text" v-model="nickname" placeholder="Your nickname" />
        </div>

        <div class="row">
          <label>{{ t("SettingsView.bio") }}</label>
          <textarea class="textarea" v-model="bio" placeholder="Write something about yourself..."></textarea>
        </div>

        <div class="row-inline">
          <label><i class="fas fa-globe"></i> {{ t("SettingsView.language") }}</label>
          <button class="open-button"  @click="onShowI18NDialog">{{ t("language_name") }} &nbsp;&nbsp; <i class="fas fa-gear"></i></button>
        </div>

        <div class="row-inline">
          <label><i class="fas fa-palette"></i> {{ t("SettingsView.theme.title") }}</label>
          <select v-model="selectedTheme" class="input">
            <option value="light">{{ t("SettingsView.theme.light") }}</option>
            <option value="dark">{{ t("SettingsView.theme.dark") }}</option>
          </select>
        </div>

        <!-- <div class="row">
          <label>Avatar URL</label>
          <input class="input" type="text" v-model="avatarUrl" placeholder="Image URL (optional)" />
        </div>

        <div v-if="avatarUrl" class="avatar-preview">
          <img :src="avatarUrl" alt="avatar" />
        </div> -->

        <button class="big-button" @click="saveProfile">{{ t("SettingsView.save") }}</button>
        <button class="big-button logout-button" @click="logout">{{ t("SettingsView.logout") }}</button>
      </div>
    </div>

    <div style="height: 50px;"></div>
    
    <SlotDialog id="language-dialog" :showCancel="true" :visible="showI18NDialog" @confirm="onLocaleChange"
            @cancel="showI18NDialog = false">
            <template #title>
                <h3>{{ t("LoginView.language") }}</h3>
            </template>
            <div class="language-container">
                <select v-model="selectedLocale" class="input">
                    <option v-for="lang in langList" :key="lang.code" :value="lang.code">
                        {{ lang.name }}
                    </option>
                </select>
            </div>
        </SlotDialog>
    
        <Dialog :visible="showDialog" :message="dialogMessage" @confirm="showDialog = false" />


    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '../components/TabBar.vue'

import { useI18n } from 'vue-i18n'
import SlotDialog from '../components/SlotDialog.vue';
import Dialog from '../components/Dialog.vue';

const { t, locale } = useI18n();

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const email = ref('')
const nickname = ref('')
const bio = ref('')
const avatarUrl = ref('')
const uuid = ref('')

const showDialog = ref(false);
const dialogMessage = ref('');


const showI18NDialog = ref(false);

const selectedLocale = ref('en');

const langList = [
    { code: 'en', name: 'English' },
    { code: 'zh-tw', name: '繁體中文' },
    { code: 'ja', name: '日本語' }
];

const selectedTheme = ref(localStorage.getItem('theme') || 'light');

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

  const theme = selectedTheme.value;
  localStorage.setItem('theme', theme);

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


    dialogMessage.value = t("SettingsView.update_success");
    showDialog.value = true;
    // alert('Profile updated!')

    
    setTimeout(() => {
      showDialog.value = false;
      location.reload();
    }, 1500);
  } catch (err) {
    console.error(err)
    alert('Update failed.')

    dialogMessage.value = t("SettingsView.update_error");
    showDialog.value = true;
  }
}

function logout() {
  localStorage.removeItem('token')
  router.push('/')
}

function onShowI18NDialog() {
    const savedLocale = localStorage.getItem('locale');
    selectedLocale.value = langList.some(lang => lang.code === savedLocale) ? savedLocale || 'en' : 'en';
    showI18NDialog.value = true;
}

function onLocaleChange() {
    if (selectedLocale.value) {
        // 更新 i18n 的 locale
        locale.value = selectedLocale.value;

        // 儲存選擇的語言到 localStorage
        localStorage.setItem('locale', selectedLocale.value);

        showI18NDialog.value = false; // 關閉對話框
    }
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

.row-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.readonly-field {
  font-size: 16px;
  color: var(--color-text);
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


.open-button {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  font-size: 16px;
  background-color: var(--color-primary);
  color: var(--color-accent);
  gap: 0.3rem;
}
</style>
