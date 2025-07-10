<template>
  <div class="mobile-page-base">
    <div class="container">
      <div class="header-row">
        <h2 class="section-title">Register</h2>
        <i class="fas fa-home home-icon" @click="goHome"></i>
      </div>

      <div class="row">
        <label>Email</label>
        <input v-model="email" type="email" class="input" placeholder="Enter your email" required />
      </div>

      <div class="row">
        <label>Password</label>
        <input v-model="password" type="password" class="input" placeholder="Create a password" required />
      </div>

      <div class="row">
        <label>Nickname</label>
        <input v-model="nickname" type="text" class="input" placeholder="Pick a nickname" required />
      </div>

      <div class="row">
        <label>Bio</label>
        <textarea v-model="bio" class="textarea" rows="3" placeholder="Write something about yourself..."></textarea>
      </div>

      <button class="big-button" @click="register">Submit</button>

    </div>

    <Dialog :visible="showDialog" :message="dialogMessage" @confirm="showDialog = false" />

  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from '../components/Dialog.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const nickname = ref('')
const bio = ref('')
// const errorMessage = ref('')
// const successMessage = ref('')

const API_URL = import.meta.env.VITE_API_URL

const showDialog = ref(false)
const dialogMessage = ref('')


const register = async () => {
  // 前端欄位檢查
  if (!email.value || !password.value || !nickname.value) {
    dialogMessage.value = 'Please fill in all required fields.'
    showDialog.value = true
    return
  }

  try {
    const res = await axios.post(`${API_URL}/auth/register`, {
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      bio: bio.value
    })

    localStorage.setItem('token', res.data.token)
    dialogMessage.value = 'Registration successful! Redirecting to the homepage...'
    showDialog.value = true

    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } catch (err: any) {
    dialogMessage.value = err.response?.data?.message || 'Registration failed, please try again later.'
    showDialog.value = true
  }
}


const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.home-icon {
  font-size: 16px;
  color: var(--color-primary);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.home-icon:hover {
  transform: scale(1.2);
}

.row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input,
.textarea {
  padding: 0.6rem 0.8rem;
  border-radius: 5px;
  border: none;
  background-color: var(--color-accent);
  font-family: 'Source Serif Pro', serif;
  font-size: 16px;
  color: var(--color-text);
}

.input:focus,
.textarea:focus {
  outline: 2px solid var(--color-primary);
}


.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>