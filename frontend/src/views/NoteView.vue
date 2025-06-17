<template>
    <div class="note-page">
        <div class="note-container">
            <h2 class="section-title">Note</h2>

            <div class="row">
                <label>Title</label>
                <input type="text" class="input" placeholder="Title" />
            </div>

            <div class="row horizontal">
                <div class="field mood">
                    <label>Mood</label>
                    <select class="input">
                        <option>😊</option>
                        <option>😢</option>
                        <option>😡</option>
                        <option>😱</option>
                        <option>😐</option>
                    </select>
                </div>

                <div class="field intensity">
                    <label>Intensity</label>
                    <select class="input">
                        <option>Low</option>
                        <option>Moderate</option>
                        <option>High</option>
                    </select>
                </div>
            </div>

            <div class="row">
                <label>Datetime</label>
                <input type="datetime-local" class="input" />
            </div>

            <div class="row">
                <label>Location</label>
                <input type="text" class="input" placeholder="11.111111N; 100.111111E" />
            </div>

            <div class="row">
                <label>Description</label>
                <textarea class="textarea" rows="4" placeholder="Write something..."></textarea>
            </div>

            <div class="row">
                <label>Image</label>
                <div class="image-upload">
                    <i class="fas fa-plus fa-2x"></i>
                </div>
            </div>


            <div class="row">
                <label>Map</label>
                <MapView class="small-map" />
            </div>
        </div>

        <div style="height: 50px;"></div>



        <TabBar />
    </div>
</template>

<script setup lang="ts">
import TabBar from '../components/TabBar.vue';
import MapView from '../components/MapView.vue';
</script>

<style scoped lang="scss">
.note-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-bg);
}

.note-container {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.section-title {
    font-size: 1.5rem;
    color: var(--color-primary);
}

.row {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.row.horizontal {
    flex-direction: row;
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.mood {
    flex: 3;
}

.intensity {
    flex: 7;
}

.input {
    padding: 0.6rem 0.8rem;
    border-radius: 5px;
    border: none;
    background-color: var(--color-accent);
    font-family: 'Source Serif Pro', serif;
    font-size: 1rem;
    color: var(--color-text);
}

.input:focus {
    outline: 2px solid var(--color-primary);
}

.textarea {
    padding: 0.6rem 0.8rem;
    border-radius: 5px;
    background-color: var(--color-accent);
    font-family: 'Source Serif Pro', serif;
    font-size: 1rem;
    resize: none;
    border: none;
    color: var(--color-text);
}

.image-upload {
    height: 120px;
    background-color: var(--color-accent);
    border-radius: 5px;
    border: 2px dashed var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    font-size: 1.8rem;
}


.small-map {
    height: 20vh;
    border-radius: 8px;
    margin-top: 0.5rem;
}
</style>