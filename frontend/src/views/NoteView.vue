<template>
  <div class="note-page">
    <div class="note-container">
      <h2 class="section-title">Note</h2>

      <!-- Title -->
      <div class="row">
        <label>Title</label>
        <input type="text" class="input" placeholder="Title" v-model="title"
          :class="{ danger: showError && !title && focused != 'title' }" @focus="focused = 'title'"
          @blur="focused = null" />
      </div>

      <!-- Mood & Intensity -->
      <div class="row horizontal">
        <div class="field mood">
          <label>Mood</label>
          <select class="input" v-model="mood" v-bind:disabled="disableMood"
            :class="{ danger: showError && !disableMood && !mood && focused != 'mood' }" @focus="focused = 'mood'"
            @blur="focused = null">
            <option value="">Select Mood</option>
            <option value="joy">😊</option>
            <option value="sad">😢</option>
            <option value="mad">😡</option>
            <option value="shook">😱</option>
          </select>
        </div>

        <div class="field intensity">
          <label>Intensity</label>
          <select class="input" v-model="intensity" v-bind:disabled="disableMood"
            :class="{ danger: showError && !disableMood && !intensity && focused != 'intensity' }"
            @focus="focused = 'intensity'" @blur="focused = null">
            <option value="1">Low</option>
            <option value="2">Moderate</option>
            <option value="3">High</option>
          </select>
        </div>
      </div>

      <!-- Checkbox: No Mood -->
      <div class="row horizontal">
        <input type="checkbox" id="disableMood" v-model="disableMood" />
        <label for="disableMood">No Mood</label>
      </div>

      <!-- Datetime -->
      <div class="row">
        <label>Datetime</label>
        <input type="datetime-local" class="input" v-model="occurredAt"
          :class="{ danger: showError && !occurredAt && focused != 'occurredAt' }" @focus="focused = 'occurredAt'"
          @blur="focused = null" />
      </div>

      <!-- Location + Search -->
      <div class="row horizontal">
        <div class="field location">
          <label>Location</label>
          <input v-model="locationQuery" type="text" class="input" placeholder="Enter a place name"
            :disabled="disableCoords"
            :class="{ danger: showError && !disableCoords && !locationQuery && focused != 'location' }"
            @focus="focused = 'location'" @blur="focused = null" />
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
        <textarea class="textarea" rows="4" placeholder="Write something..." v-model="description"
          :class="{ danger: showError && !description && focused != 'description' }" @focus="focused = 'description'"
          @blur="focused = null"></textarea>
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
          <NoteMapView :lat="mapLat" :lng="mapLng" :enableClick="true" @mapClick="handleMapClick" />
        </div>
      </div>

      <!-- Save -->
      <div class="row">
        <button class="save-button" @click="validateAndPrompt">Save</button>
      </div>
    </div>



    <div style="height: 50px;"></div>
    <TabBar />
  </div>

  <Dialog :visible="showDialog" :message="dialogMessage" :showCancel="confirmingSave" @confirm="onDialogConfirm"
    @cancel="onDialogCancel" />

</template>


<script setup lang="ts">
import { ref } from 'vue';
import TabBar from '../components/TabBar.vue';
import NoteMapView from '../components/NoteMapView.vue';

import Dialog from '../components/Dialog.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 表單欄位
const title = ref('');
const mood = ref('');
const intensity = ref('');
const occurredAt = ref('');
const description = ref('');
const locationQuery = ref('');
const disableCoords = ref(false); // ✅ 預設不儲存座標
const disableMood = ref(false); // ✅ 預設不禁用心情選擇

const showDialog = ref(false); // ✅ 用於顯示確認對話框

// 地圖座標
const mapLat = ref(25.0339);  // 初始中心點台北 101
const mapLng = ref(121.5645);

const focused = ref<string | null>(null) // 用於追蹤當前焦點欄位

// 定位按鈕
async function useCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      mapLat.value = lat;
      mapLng.value = lng;

      try {
            const params = new URLSearchParams({
      format: 'json',
      lat: lat.toString(),
      lon: lng.toString()
    });
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`);
        const data = await response.json();
        locationQuery.value = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      } catch {
        locationQuery.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    },
    (err) => {
      console.error('定位失敗', err);
      // alert('無法取得定位');
      showDialog.value = true;
      dialogMessage.value = 'Cannot get current location. Please enter coordinates manually, or check your browser settings.';
    }
  );
}

// 點地圖事件
async function handleMapClick({ lat, lng }: { lat: number; lng: number }) {
  mapLat.value = lat;
  mapLng.value = lng;

  try {

    const params = new URLSearchParams({
      format: 'json',
      lat: lat.toString(),
      lon: lng.toString()
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`);
    const data = await response.json();
    locationQuery.value = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.warn('反查失敗, 改為經緯度', error);
    locationQuery.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

// 地名搜尋
async function searchLocation() {
  if (!locationQuery.value) return;

  const latlngRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  if (latlngRegex.test(locationQuery.value.trim())) {
    const [latStr, lngStr] = locationQuery.value.split(',');
    const lat = parseFloat(latStr.trim());
    const lng = parseFloat(lngStr.trim());

    if (!isNaN(lat) && !isNaN(lng)) {
      mapLat.value = lat;
      mapLng.value = lng;
      return;
    }
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery.value)}`);
    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lng);
      mapLat.value = lat;
      mapLng.value = lng;
    } else {
      // alert('Location not found');
      showDialog.value = true;
      dialogMessage.value = 'Location not found. Please try another search term.';
    }
  } catch (error) {
    console.error('搜尋失敗', error);
  }
}



const showError = ref(false);
const dialogMessage = ref('');
const confirmingSave = ref(false);

function validateAndPrompt() {
  showError.value = false;
  let missing = [];
  if (!title.value) missing.push('Title');
  if (!disableMood.value && !mood.value) missing.push('Mood');
  if (!disableMood.value && !intensity.value) missing.push('Intensity');
  if (!occurredAt.value) missing.push('Datetime');
  if (!disableCoords.value && !locationQuery.value) missing.push('Location');
  if (!description.value) missing.push('Description');

  if (missing.length > 0) {
    showError.value = true;
    dialogMessage.value = 'Missing: \n' + missing.join(', ');
    confirmingSave.value = false;
    showDialog.value = true;
  } else {
    dialogMessage.value = `Save this note ${disableCoords.value || disableMood.value ? 'without:' : ''} ${(disableCoords.value ? 'Location, ' : '') +
      (disableMood.value ? 'Mood, Intensity' : '')
      }?`;
    confirmingSave.value = true;
    showDialog.value = true;
  }
}


function onDialogConfirm() {
  if (!confirmingSave.value) {
    showDialog.value = false;
    return;
  }
  showDialog.value = false;
  confirmingSave.value = false;
  saveNote();
}

const saving = ref(false);

async function saveNote() {

  if (saving.value) return; // 防止重複提交
  saving.value = true;


  const API_URL = import.meta.env.VITE_API_URL

  const note = {
    title: title.value,
    mood: !(disableMood.value) ? mood.value : '',
    intensity: !(disableMood.value) ? Number(intensity.value) : 0,
    occurredAt: occurredAt.value,
    locationName: !(disableCoords.value) ? locationQuery.value : '',
    location: !(disableCoords.value)
      ? { lat: mapLat.value, lng: mapLng.value }
      : null,
    description: description.value,
    imageUrl: null
  };

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API_URL}/memories`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
    
      body: JSON.stringify(note)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to save');
    }

    const result = await res.json();
    console.log('✅ Saved to backend:', result);

    // ✅ 顯示提示
    dialogMessage.value = 'Note saved successfully!';
    showDialog.value = true;

    setTimeout(() => {
      router.push('/story');
    }, 1500);



  } catch (err) {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      dialogMessage.value = 'Network error. Please check your internet or try again later.';
    } else {
      dialogMessage.value = `Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
    showDialog.value = true;
  } finally {
    saving.value = false;
  }
}


function onDialogCancel() {
  showDialog.value = false;
  confirmingSave.value = false;
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

.input.danger,
.textarea.danger {
  border: 2px solid var(--color-danger);
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
