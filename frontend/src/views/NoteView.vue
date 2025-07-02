<template>
  <div class="note-page">
    <div class="note-container">
      <h2 class="section-title">Note</h2>

      <!-- Title -->
      <div class="row">
        <label>Title</label>
        <template v-if="isReadOnly">
          <div class="readonly-field">{{ title }}</div>
        </template>
        <template v-else>
          <input type="text" class="input" placeholder="Title" v-model="title"
            :class="{ danger: showError && !title && focused != 'title' }" @focus="focused = 'title'"
            @blur="focused = null" />
        </template>
      </div>


      <!-- Mood & Intensity -->
      <div class="row horizontal">
        <div class="field mood">
          <label>Mood</label>
          <template v-if="isReadOnly">
            <div class="readonly-field">{{ mood || '-' }}</div>
          </template>
          <template v-else>
            <select class="input" v-model="mood" :disabled="disableMood"
              :class="{ danger: showError && !disableMood && !mood && focused != 'mood' }" @focus="focused = 'mood'"
              @blur="focused = null">
              <option value="">Select Mood</option>
              <option value="joy">😊</option>
              <option value="sad">😢</option>
              <option value="mad">😡</option>
              <option value="shook">😱</option>
            </select>
          </template>
        </div>

        <div class="field intensity">
          <label>Intensity</label>
          <template v-if="isReadOnly">
            <div class="readonly-field">{{ intensity || '-' }}</div>
          </template>
          <template v-else>
            <select class="input" v-model="intensity" :disabled="disableMood"
              :class="{ danger: showError && !disableMood && !intensity && focused != 'intensity' }"
              @focus="focused = 'intensity'" @blur="focused = null">
              <option value="1">Low</option>
              <option value="2">Moderate</option>
              <option value="3">High</option>
            </select>
          </template>
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
        <template v-if="isReadOnly">
          <div class="readonly-field">{{ occurredAt }}</div>
        </template>
        <template v-else>
          <input type="datetime-local" class="input" v-model="occurredAt"
            :class="{ danger: showError && !occurredAt && focused != 'occurredAt' }" @focus="focused = 'occurredAt'"
            @blur="focused = null" />
        </template>
      </div>


      <!-- Location + Search -->
      <div class="row horizontal">
        <div class="field location">
          <label>Location</label>
          <template v-if="isReadOnly">
            <div class="readonly-field">{{ locationQuery }}</div>
          </template>
          <template v-else>
            <input v-model="locationQuery" type="text" class="input" placeholder="Enter a place name"
              :disabled="disableCoords"
              :class="{ danger: showError && !disableCoords && !locationQuery && focused != 'location' }"
              @focus="focused = 'location'" @blur="focused = null" />
          </template>
        </div>

        <button class="geo-button" @click="useCurrentLocation" :disabled="disableCoords || isReadOnly">
          <i class="fas fa-crosshairs"></i>
        </button>
        <button class="search-button" @click="searchLocation" :disabled="disableCoords || isReadOnly">Search</button>
      </div>


      <!-- Checkbox: Include coordinates -->
      <div class="row horizontal" style="align-items: center;">
        <input type="checkbox" id="disableCoords" v-model="disableCoords" />
        <label for="disableCoords">Don't save coordinates</label>
      </div>

      <!-- Description -->
      <div class="row">
        <label>Description</label>
        <template v-if="isReadOnly">
          <div class="readonly-field" style="white-space: pre-wrap;">{{ description }}</div>
        </template>
        <template v-else>
          <textarea class="textarea" rows="4" placeholder="Write something..." v-model="description"
            :class="{ danger: showError && !description && focused != 'description' }" @focus="focused = 'description'"
            @blur="focused = null"></textarea>
        </template>
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
          <NoteMapView :lat="mapLat" :lng="mapLng" :enableClick="!isReadOnly" @mapClick="handleMapClick" />
        </div>
      </div>


      <div class="row" v-if="isEditing">
        <!-- Cancel only in edit mode -->
        <button class="cancel-button" @click="cancelEdit">
          Cancel
        </button>
      </div>
      <!-- Save, Edit 按鈕 -->
      <div class="row">


        <!-- Save only in non-readonly -->
        <button v-if="!isReadOnly" class="save-button" @click="validateAndPrompt">
          Save
        </button>

        <!-- Edit only in readonly -->
        <button v-if="isReadOnly" class="save-button" @click="goToEditPage">
          Edit
        </button>
      </div>

      <div class="row" v-if="isReadOnly">

        <button class="delete-button" @click="promptDelete">
          Delete
        </button>
      </div>




    </div>



    <div style="height: 50px;"></div>
    <TabBar />
  </div>

  <Dialog :visible="showDialog" :message="dialogMessage" :showCancel="confirmingSave" @confirm="onDialogConfirm"
    @cancel="onDialogCancel" />

</template>


<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import TabBar from '../components/TabBar.vue';
import NoteMapView from '../components/NoteMapView.vue';

import Dialog from '../components/Dialog.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
import { useRoute } from 'vue-router';
import axios from 'axios';
const route = useRoute();
const uuid = route.params.uuid as string | undefined
const isReadOnly = ref(false)
const isEditing = ref(false)


const confirmingDelete = ref(false)


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

const API_URL = import.meta.env.VITE_API_URL;




watch(() => route.fullPath, (newPath) => {
  if (newPath === '/note/new') {
    isReadOnly.value = false
    isEditing.value = false
    resetForm()
  } else if (newPath.startsWith('/note/read/')) {
    isReadOnly.value = true
    isEditing.value = false
    const uuid = route.params.uuid as string
    fetchMemory(uuid)
  } else if (newPath.startsWith('/note/edit/')) {
    isReadOnly.value = false
    isEditing.value = true
    const uuid = route.params.uuid as string
    fetchMemory(uuid)
  }
})

function resetForm() {
  title.value = ''
  mood.value = ''
  intensity.value = ''
  occurredAt.value = ''
  description.value = ''
  locationQuery.value = ''
  disableCoords.value = false
  disableMood.value = false
  mapLat.value = 25.0339
  mapLng.value = 121.5645
}

function goToEditPage() {
  const uuid = route.params.uuid as string
  router.push(`/note/edit/${uuid}`)
}


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
        const response = await fetch(`${API_URL}/proxy/reverse?lat=${lat}&lon=${lng}`);
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
    const response = await fetch(`${API_URL}/proxy/search?q=${encodeURIComponent(locationQuery.value)}`);
    const data = await response.json();

    console.debug(data)

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates from geocoding");
      }

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
  if (confirmingSave.value) {
    showDialog.value = false
    confirmingSave.value = false
    saveNote()
  } else if (confirmingDelete.value) {
    showDialog.value = false
    confirmingDelete.value = false
    deleteMemory()
  } else {
    showDialog.value = false
  }
}

const saving = ref(false);

function cancelEdit() {
  const uuid = route.params.uuid as string
  if (uuid) {
    router.push(`/note/read/${uuid}`)
  } else {
    router.push('/home')
  }
}


const saveNote = async () => {
  if (saving.value) return
  saving.value = true

  const token = localStorage.getItem('token')
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
  }

  const url = isEditing.value
    ? `${API_URL}/memories/${route.params.uuid}`
    : `${API_URL}/memories`
  const method = isEditing.value ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(note)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to save')
    }

    const result = await res.json()
    dialogMessage.value = isEditing.value ? 'Note updated!' : 'Note saved successfully!'
    showDialog.value = true

    setTimeout(() => {
      if (isEditing.value && route.params.uuid) {
        router.push(`/note/read/${route.params.uuid}`)
      } else {
        router.push('/home')
      }
    }, 1500)

  } catch (err) {
    dialogMessage.value = `Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    showDialog.value = true
  } finally {
    saving.value = false
  }
}


function onDialogCancel() {
  showDialog.value = false;
  confirmingSave.value = false;
}

async function fetchMemory(uuid: string) {
  const API_URL = import.meta.env.VITE_API_URL
  try {
    const res = await axios.get(`${API_URL}/memories/${uuid}`)
    const data = res.data

    title.value = data.title
    mood.value = data.mood || ''
    intensity.value = data.intensity?.toString() || ''
    occurredAt.value = data.occurredAt?.slice(0, 16) || ''
    description.value = data.description
    locationQuery.value = data.locationName || ''
    mapLat.value = data.location?.lat || 25.0339
    mapLng.value = data.location?.lng || 121.5645

    disableCoords.value = !data.location
    disableMood.value = !data.mood && !data.intensity
  } catch (err) {
    console.error('Error loading memory', err)
  }
}


onMounted(() => {
  const path = route.path
  const uuid = route.params.uuid as string

  if (path.startsWith('/note/edit/') && uuid) {
    isReadOnly.value = false
    isEditing.value = true
    fetchMemory(uuid)
  } else if (path.startsWith('/note/read/') && uuid) {
    isReadOnly.value = true
    isEditing.value = false
    fetchMemory(uuid)
  } else if (path === '/note/new') {
    isReadOnly.value = false
    isEditing.value = false
    resetForm()
  }
})


function promptDelete() {
  dialogMessage.value = 'Are you sure you want to delete this memory?'
  confirmingDelete.value = true
  showDialog.value = true
}

async function deleteMemory() {
  const uuid = route.params.uuid as string
  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`${API_URL}/memories/${uuid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) throw new Error('Failed to delete')

    dialogMessage.value = 'Memory deleted.'
    showDialog.value = true

    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } catch (err) {
    dialogMessage.value = `Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    showDialog.value = true
  }
}


</script>


<style scoped lang="scss">
/* === 狀態樣式 === */

.readonly-field {
  background-color: transparent;
  font-size: 1rem;
  color: var(--color-text);
  padding: 0.4rem 0;
}

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

input[type="datetime-local"] {
  width: 100%;
  min-width: 100%;
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
  font-size: 16px;
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
  font-size: 16px;
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
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* === 區塊排版 === */
.row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.row.horizontal {
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap; // ⬅ 加這行最保險
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
  padding: 0.6rem 16px;
  background-color: var(--color-primary);
  color: white;
  font-size: 16px;
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
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.save-button {
  margin-top: 16px;
  padding: 0.8rem;
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}

.cancel-button {
  @extend .save-button;
  background-color: var(--color-accent);
  color: var(--color-text);
}

.delete-button {
  @extend .save-button;
  background-color: var(--color-danger);
  color: white;

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
  font-size: 24px;
}


@media (max-width: 360px) {
  .row.horizontal.location-row {
    flex-direction: column;

    .geo-button,
    .search-button {
      width: 100%;
    }
  }
}
</style>
