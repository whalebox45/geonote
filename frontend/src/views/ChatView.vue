<template>
    <div class="chat-page">
        <div class="chat-container">
            <h2 class="section-title">Chat</h2>

            <div class="chat-messages">
                <div class="chat-bubble">&gt; Hi! How can I assist you today?</div>
                <div class="chat-bubble">&gt; blah blah blah</div>
                <div class="chat-bubble">&gt; test test test</div>
            </div>

            <div class="chat-input-row">
                <input type="text" class="chat-input" placeholder="Send a message..." />
                <button class="send-button">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>

        <TabBar />
    </div>
</template>

<script setup lang="ts">
import TabBar from '../components/TabBar.vue';
</script>

<style scoped lang="scss">
.chat-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-bg);
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    padding-bottom: 4rem; // ✅ 保證輸入區不被蓋住
    overflow-y: auto;
}

.section-title {
    font-size: 1.5rem;
    color: var(--color-primary);
    margin-bottom: 1rem;
}

.chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 1rem;
}

.chat-bubble {
    background-color: var(--color-accent);
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    font-family: 'Source Serif Pro', serif;
    font-size: 1rem;
    color: var(--color-text);
    align-self: flex-start;
    white-space: pre-wrap;
}

.chat-input-row {
    display: flex;
    gap: 0.5rem;
}

.chat-input {
    flex: 1;
    padding: 0.6rem 0.8rem;
    border: none;
    border-radius: 5px;
    background-color: var(--color-accent);
    font-family: 'Source Serif Pro', serif;
    font-size: 1rem;
}

.chat-input:focus {
    outline: 2px solid var(--color-primary);
}

.send-button {
    padding: 0.6rem 0.9rem;
    font-size: 1rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.send-button:hover {
    opacity: 0.9;
}
</style>