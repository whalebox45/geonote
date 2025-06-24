<template>
  <div class="register-page">
    <div class="register-container">
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

      <button class="submit-button" @click="register">Submit</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const nickname = ref('')
const bio = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const API_URL = import.meta.env.VITE_API_URL

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const res = await axios.post(`${API_URL}/auth/register`, {
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      bio: bio.value
    })

    localStorage.setItem('token', res.data.token)
    successMessage.value = '註冊成功！'
    router.push('/story')
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Registration failed.'
  }
  
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.register-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

.register-container {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.home-icon {
  font-size: 1.3rem;
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
  font-size: 1rem;
  color: var(--color-text);
}

.input:focus,
.textarea:focus {
  outline: 2px solid var(--color-primary);
}

.submit-button {
  padding: 0.7rem 1rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
  font-family: 'Source Serif Pro', serif;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-button:hover {
  opacity: 0.9;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>