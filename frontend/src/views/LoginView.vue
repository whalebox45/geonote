<template>
    <div class="login-container">
        <div class="login-inner">
            <div class="title">
                <h1>GeoNote</h1>
            </div>

            <div class="form">
                <input type="text" placeholder="Username" class="input" v-model="username" />
                <input type="password" placeholder="Passphrase" class="input" v-model="password" />
            </div>

            <div class="btn-group">

                <button class="register-button" @click="goToRegister">
                    <i class="fas fa-user-plus"></i>
                    {{ t("LoginView.register") }}
                </button>

                <button class="login-button" @click="login">
                    <i class="fas fa-sign-in-alt"></i>
                    {{ t("LoginView.login") }}
                </button>
            </div>

            <div class="bottom-container">
                <button class="i18n-button" @click="onShowI18NDialog">
                    <!-- {{ t("LoginView.language") }} -->
                    <i class="fas fa-globe"></i>
                </button>
            </div>
        </div>
        <Dialog :visible="showDialog" :message="dialogMessage" @confirm="showDialog = false" />

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
    </div>


</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';


import Dialog from '../components/Dialog.vue';

import { useI18n } from 'vue-i18n';
import SlotDialog from '../components/SlotDialog.vue';
const { t, locale } = useI18n();

const router = useRouter();

const API_URL = import.meta.env.VITE_API_URL;

const username = ref('');
const password = ref('');

const showDialog = ref(false);
const dialogMessage = ref('');

const showI18NDialog = ref(false);

const selectedLocale = ref('en');

const langList = [
    { code: 'en', name: 'English' },
    { code: 'zh-tw', name: '繁體中文' },
    { code: 'ja', name: '日本語' }
];

onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
        router.push('/home')
    }
})

const login = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: username.value, // 替換為實際的用戶名
            password: password.value // 替換為實際的密碼
        });

        if (res.status === 200) {
            // 登入成功，處理登入邏輯
            console.log('Login successful:', res.data);

            // 可以在這裡儲存 token 或其他用戶資料
            localStorage.setItem('token', res.data.token); // 假設 API 返回 token

            goToHome(); // 登入成功後跳轉到故事頁面
        } else {
            console.error('Login failed:', res.data);
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            dialogMessage.value = t("LoginView.invalid_credentials");
        } else {
            dialogMessage.value = t("LoginView.login_error");
        }
        showDialog.value = true;
    }
}

function goToHome() {
    router.push('/home');
}

function goToRegister() {
    router.push('/register');
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
.login-container {
    height: 100vh;
    width: 100%;
    background-color: var(--color-bg);
    display: flex;
    justify-content: center;
}

.login-inner {
    width: 100%;
    max-width: 320px;
    margin-top: 50vh; // 🟢 從視窗中央「往下」開始排
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    margin-bottom: 0.5rem;
    width: 100%;

    h1 {
        font-size: 3rem;
        color: var(--color-text);
    }
}

.form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.btn-group {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    gap: 0.5rem;

    button {
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        opacity: 0.9;
    }
}

.login-button {
    width: 33.3333%; // 約 1/3
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 16px;
    background-color: var(--color-primary);
    color: var(--color-accent);
    gap: 0.3rem;
}

.backtologin-button {
    width: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 16px;
    background-color: var(--color-accent);
    color: var(--color-primary);
    gap: 0.3rem;
}

.register-button {
    width: 33.3333%; // 約 1/3
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 16px;
    background-color: var(--color-accent);
    color: var(--color-primary);
    gap: 0.3rem;
}

.input {
    padding: 0.6rem 0.8rem;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: var(--color-accent);
    color: var(--color-text);
}

.input:focus {
    outline: 2px solid var(--color-primary);
}

.bottom-container {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.5rem; // optional, for spacing

}

.i18n-button {
    background-color: var(--color-primary);
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--color-accent);
    font-size: 1rem;
}

.input {
    padding: 0.6rem 0.8rem;
    border-radius: 5px;
    border: none;
    background-color: var(--color-accent);
    font-size: 16px;
    color: var(--color-text);
}
</style>