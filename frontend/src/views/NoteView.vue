<template>
  <div class="note-page">
    <div class="note-container">
      <h2 class="section-title">Note</h2>

      <!-- Title -->
      <div class="row">
        <label>Title</label>
        <input type="text" class="input" placeholder="Title" v-model="title" />
      </div>

      <!-- Mood & Intensity -->
      <div class="row horizontal">
        <div class="field mood">
          <label>Mood</label>
          <select class="input" v-model="mood" v-bind:disabled="noMood">
            <option>😊</option>
            <option>😢</option>
            <option>😡</option>
            <option>😱</option>
            <option>😐</option>
          </select>
        </div>

        <div class="field intensity">
          <label>Intensity</label>
          <select class="input" v-model="intensity" v-bind:disabled="noMood">
            <option value="1">Low</option>
            <option value="2">Moderate</option>
            <option value="3">High</option>
          </select>
        </div>
      </div>

      <!-- Checkbox: No Mood -->
      <div class="row horizontal">
        <input type="checkbox" id="noMood" v-model="noMood" />
        <label for="noMood">No Mood</label>
      </div>

      <!-- Datetime -->
      <div class="row">
        <label>Datetime</label>
        <input type="datetime-local" class="input" v-model="datetime" />
      </div>

      <!-- Location + Search -->
      <div class="row horizontal">
        <div class="field location">
          <label>Location</label>
          <input v-model="locationQuery" type="text" class="input" placeholder="Enter a place name"
            :disabled="disableCoords" />
        </div>
        <button class="geo-button" @click="useCurrentLocation" :disabled="disableCoords" title="Use current location">
          <i class="fas fa-crosshairs"></i>
        </button>
        <button class="search-button" @click="searchLocation" :disabled="disableCoords">Search</button>
      </div>

      <!-- Checkbox: Include coordinates -->
      <div class="row horizontal" style="align-items: center;">
        <input type="checkbox" id="disableCoords" v-model="disableCoords" />
        <label for="disableCoords">Don't save coordinates</label>
      </div>

      <!-- Description -->
      <div class="row">
        <label>Description</label>
        <textarea class="textarea" rows="4" placeholder="Write something..." v-model="description"></textarea>
      </div>

      <!-- Image Upload -->
      <div class="row">
        <label>Image</label>
        <div class="image-upload">
          <i class="fas fa-plus fa-2x"></i>
        </div>
      </div>

      <!-- Map -->
      <div class="row">
        <label>Map</label>
        <div class="small-map-wrapper">
          <NoteMapView :lat="mapLat" :lon="mapLon" :enableClick="true" @mapClick="handleMapClick" />
        </div>
      </div>

      <!-- Save -->
      <div class="row">
        <button class="save-button" @click="saveNote">Save</button>
      </div>
    </div>



    <div style="height: 50px;"></div>
    <TabBar />
  </div>

  <Dialog
  :visible="showDialog"
  message="你確定要儲存這筆資料嗎？"
  :showCancel="true"
  @confirm="onDialogConfirm"
  @cancel="onDialogCancel" />

</template>


<script setup lang="ts">
import { ref } from 'vue';
import TabBar from '../components/TabBar.vue';
import NoteMapView from '../components/NoteMapView.vue';

import Dialog from '../components/Dialog.vue';

// 表單欄位
const title = ref('');
const mood = ref('');
const intensity = ref('');
const datetime = ref('');
const description = ref('');
const locationQuery = ref('');
const disableCoords = ref(false); // ✅ 預設不儲存座標
const noMood = ref(false); // ✅ 預設不禁用心情選擇

const showDialog = ref(false); // ✅ 用於顯示確認對話框

// 地圖座標
const mapLat = ref(25.0339);  // 初始中心點台北 101
const mapLon = ref(121.5645);

// 定位按鈕
async function useCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      mapLat.value = lat;
      mapLon.value = lon;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        locationQuery.value = data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      } catch {
        locationQuery.value = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      }
    },
    (err) => {
      console.error('定位失敗', err);
      alert('無法取得定位');
    }
  );
}

// 點地圖事件
async function handleMapClick({ lat, lon }: { lat: number; lon: number }) {
  mapLat.value = lat;
  mapLon.value = lon;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    locationQuery.value = data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  } catch (error) {
    console.error('反查失敗', error);
    locationQuery.value = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
}

// 地名搜尋
async function searchLocation() {
  if (!locationQuery.value) return;

  const latlonRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  if (latlonRegex.test(locationQuery.value.trim())) {
    const [latStr, lonStr] = locationQuery.value.split(',');
    const lat = parseFloat(latStr.trim());
    const lon = parseFloat(lonStr.trim());

    if (!isNaN(lat) && !isNaN(lon)) {
      mapLat.value = lat;
      mapLon.value = lon;
      return;
    }
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery.value)}`);
    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      mapLat.value = lat;
      mapLon.value = lon;
    } else {
      alert('查無地點');
    }
  } catch (error) {
    console.error('搜尋失敗', error);
  }
}

// 儲存 JSON
function saveNote() {
  const note = {
    title: title.value,
    mood: !(noMood.value) ? mood.value: '',
    intensity: !(noMood.value) ? Number(intensity.value): 0,
    datetime: datetime.value,
    locationName: !(disableCoords.value) ? locationQuery.value : '',
    location: !(disableCoords.value)
      ? { lat: mapLat.value, lon: mapLon.value }
      : null,
    description: description.value,
    imageUrl: null
  };

  console.log('✅ Note JSON:', JSON.stringify(note, null, 2));

  // 顯示確認對話框
  showDialog.value = true;
}


function onDialogConfirm() {
  showDialog.value = false;
  // 在這裡處理確認刪除的邏輯
  console.log('✅ 確認');
}
function onDialogCancel() {
  showDialog.value = false;
  // 在這裡處理取消刪除的邏輯
  console.log('❌ 取消');
}

</script>


<style scoped lang="scss">
/* === 狀態樣式 === */
.input:disabled,
button:disabled {
  background-color: var(--color-disabled);
  color: var(--color-disabled-bg);
  cursor: not-allowed;
}

/* === 文字與按鈕 === */
button {
  font-family: 'Source Serif Pro', serif;
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

/* === 主容器 === */
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

/* === 區塊排版 === */
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

/* === 欄位比例 === */
.mood {
  flex: 3;
}

.intensity {
  flex: 7;
}

.location {
  flex: 7;
}

/* === 地圖 === */
.small-map-wrapper {
  width: 100%;
  height: 20vh;
  overflow: hidden;
  border-radius: 8px;
}

.small-map {
  width: 100%;
  height: 100%;
}

/* === 按鈕樣式 === */
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

.geo-button {
  align-self: flex-end;
  padding: 0.6rem;
  background-color: var(--color-accent);
  color: var(--color-text);
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
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

/* === 圖片上傳區塊 === */
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
</style>
