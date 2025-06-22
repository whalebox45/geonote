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

      <!-- 地名搜尋 -->
      <div class="row horizontal">
        <div class="field location">
          <label>Location</label>
          <input v-model="locationQuery" type="text" class="input" placeholder="Enter a place name" />
        </div>
        <button class="search-button" @click="searchLocation">Search</button>
      </div>

      <!-- 描述 -->
      <div class="row">
        <label>Description</label>
        <textarea class="textarea" rows="4" placeholder="Write something..."></textarea>
      </div>

      <!-- 圖片上傳 -->
      <div class="row">
        <label>Image</label>
        <div class="image-upload">
          <i class="fas fa-plus fa-2x"></i>
        </div>
      </div>

      <!-- 地圖 -->
      <div class="row">
        <label>Map</label>
        <div class="small-map-wrapper">
          <MapView :lat="mapLat" :lon="mapLon" class="small-map" :enableClick="true" />
        </div>
      </div>

      <div class="row">
        <button class="save-button" @click="saveNote">Save</button>
      </div>

    </div>



    <div style="height: 50px;"></div>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabBar from '../components/TabBar.vue';
import MapView from '../components/MapView.vue';

const locationQuery = ref('');
const mapLat = ref(25.0339);  // 預設台北101
const mapLon = ref(121.5645);

function saveNote() {
  const note = {
    title: '', // 你可以綁 v-model 實作完整輸出
    mood: '',
    intensity: '',
    datetime: '',
    location: locationQuery.value,
    lat: mapLat.value,
    lon: mapLon.value,
    description: '',
  };

  console.log('Note saved:', note);
}

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

.location {
  flex: 7;
}

.search-button {
  align-self: flex-end;
  padding: 0.6rem 1rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
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

.small-map-wrapper {
  width: 100%;
  height: 20vh;
}

.small-map {
  width: 100%;
  height: 100%;
}


.save-button {
  margin-top: 1rem;
  padding: 0.8rem;
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
</style>