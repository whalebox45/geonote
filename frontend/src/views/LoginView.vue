<template>
    <div class="login-container">
        <div class="login-inner">
            <div class="title">
                <h1>GeoNote</h1>
            </div>

            <div class="form">
                <input type="text" placeholder="Username" class="input" v-model="username"/>
                <input type="password" placeholder="Passphrase" class="input" v-model="password"/>
            </div>

            <div class="btn-group">

                <button class="register-button" @click="goToRegister">
                    <i class="fas fa-user-plus"></i>
                    Sign Up
                </button>

                <button class="login-button" @click="login">
                    <i class="fas fa-sign-in-alt"></i>
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const API_URL = import.meta.env.VITE_API_URL;

const username = ref('');
const password = ref('');


const login = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: username.value, // 替換為實際的用戶名
            password:  password.value // 替換為實際的密碼
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
        console.error('Login error:', err);
        if (err.response && err.response.status === 401) {
            // 處理未授權錯誤
            console.error('Invalid username or password. Please try again.');
        } else {
            // 處理其他錯誤
            console.error('An error occurred while logging in. Please try again later.');
        }
    }
}

function goToHome() {
    router.push('/home');
}

function goToRegister() {
    router.push('/register');
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
    font-family: 'Source Serif Pro', serif;
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
    font-family: 'Source Serif Pro', serif;
}

.input:focus {
    outline: 2px solid var(--color-primary);
}
</style>