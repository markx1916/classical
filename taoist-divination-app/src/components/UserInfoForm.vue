<template>
  <div class="user-info-form-container card">
    <h2>User Information Form</h2>
    <form @submit.prevent="handleSubmit" class="user-info-form">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="formData.name" placeholder="Your Name" required :disabled="isLoading" />
      </div>
      <div>
        <label for="age">Age:</label>
        <input type="number" id="age" v-model.number="formData.age" placeholder="Your Age" required min="1" :disabled="isLoading" />
      </div>
      <div>
        <label for="birthTime">Birth Time:</label>
        <input type="datetime-local" id="birthTime" v-model="formData.birthTime" required :disabled="isLoading" />
      </div>
      <div>
        <label for="region">Region:</label>
        <input type="text" id="region" v-model="formData.region" placeholder="Your Region (e.g., Beijing, New York)" required :disabled="isLoading" />
      </div>
      <div>
        <label for="predictionContent">Prediction Content:</label>
        <textarea id="predictionContent" v-model="formData.predictionContent" placeholder="What do you want to predict?" required :disabled="isLoading"></textarea>
      </div>
      <div>
        <label for="photo">Portrait Photo (Optional):</label>
        <input type="file" id="photo" @change="handlePhotoUpload" accept="image/*" :disabled="isLoading" />
        <img v-if="photoPreviewUrl" :src="photoPreviewUrl" alt="Photo Preview" class="photo-preview" />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Submitting...' : 'Get Divination' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['submit-user-data']);
const isLoading = ref(false);
const photoPreviewUrl = ref(null);

const formData = ref({
  name: '',
  age: null,
  birthTime: '',
  region: '',
  photo: null,
  predictionContent: ''
});

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.photo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    formData.value.photo = null;
    photoPreviewUrl.value = null;
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    age: null,
    birthTime: '',
    region: '',
    photo: null,
    predictionContent: ''
  };
  photoPreviewUrl.value = null;
  // Reset file input visually
  const fileInput = document.getElementById('photo');
  if (fileInput) {
    fileInput.value = '';
  }
};

const handleSubmit = async () => {
  if (formData.value.name && formData.value.age && formData.value.birthTime && formData.value.region && formData.value.predictionContent) {
    isLoading.value = true;
    try {
      // The emit itself will now be an async operation if the handler in App.vue returns a promise
      await emit('submit-user-data', { ...formData.value });
      // alert('Divination request processed.'); // Optional: feedback
      // resetForm(); // Decide if form should be reset automatically
    } catch (error) {
      console.error("Error during divination submission:", error);
      alert("There was an issue submitting your divination request. Please try again.");
    } finally {
      isLoading.value = false;
    }
  } else {
    alert('Please fill in all required fields.');
  }
};
</script>

<style scoped>
.user-info-form-container {
  /* Styles from .card and previous setup */
}

.user-info-form h2 {
  text-align: center;
  margin-bottom: 20px;
}

.user-info-form div {
  margin-bottom: 15px;
}

.user-info-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--text-light-color, #555);
}

.user-info-form input[type="text"],
.user-info-form input[type="number"],
.user-info-form input[type="datetime-local"],
.user-info-form textarea,
.user-info-form input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  background-color: var(--container-bg-color, #fff);
  color: var(--text-color, #333);
}
.user-info-form input[disabled],
.user-info-form textarea[disabled] {
  background-color: #e9ecef; /* Bootstrap-like disabled style */
  opacity: 0.7;
}


.user-info-form input[type="file"] {
  padding: 5px;
  background-color: transparent;
}

.photo-preview {
  display: block; /* Ensure it's on its own line */
  max-width: 200px;
  max-height: 200px; /* Prevent very tall images from breaking layout */
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid var(--border-color, #ddd);
  object-fit: cover; /* Scale image nicely */
}

.user-info-form textarea {
  resize: vertical;
  min-height: 80px;
}

.user-info-form button[type="submit"] {
  width: 100%;
  padding: 12px 15px;
  background-color: var(--primary-color, #5cb85c);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.user-info-form button[type="submit"]:hover {
  background-color: var(--secondary-color, #4cae4c);
}

.user-info-form button[type="submit"]:disabled {
  background-color: #a5d6a7; /* Lighter shade when disabled */
  cursor: not-allowed;
  opacity: 0.7;
}

.user-info-form input::placeholder,
.user-info-form textarea::placeholder {
  color: var(--text-light-color, #999);
  opacity: 0.8;
}
</style>
