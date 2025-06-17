<template>
    <div class="login-container">
        <div class="login-inner">
            <div class="title">
                <h1>GeoNote</h1>
            </div>

            <div class="form">
                <input type="text" placeholder="Username" class="input" />
                <input type="password" placeholder="Passphrase" class="input" />
            </div>

            <div class="btn-group">
                <button class="login-button" @click="goToStory">
                    <i class="fas fa-sign-in-alt"></i>
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

function goToStory() {
    router.push('/story');
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
        font-size: 2rem;
        color: var(--color-text);
    }
}

.form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.btn-group {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}

.login-button {
    width: 33.3333%; // 約 1/3
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.5rem;
    font-size: 1rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Source Serif Pro', serif;
}

.login-button:hover {
    opacity: 0.9;
}

.input {
    padding: 0.6rem 0.8rem;
    font-size: 1rem;
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