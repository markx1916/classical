<template>
  <div class="prediction-display-container card">
    <h2>Divination Results</h2>
    <div class="result-section">
      <h3>Your Divination</h3>
      <p class="conclusion-text">{{ conclusion }}</p>
    </div>
    <div class="explanation-section">
      <h3>Principles Behind the Reading</h3>
      <p class="explanation-text">{{ explanation }}</p>
    </div>
    <p class="timestamp" v-if="timestamp">Divination received: {{ timestamp }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  conclusion: {
    type: String,
    default: 'Awaiting your information to unveil the path...'
  },
  explanation: {
    type: String,
    default: 'The principles of divination will be revealed once your details are provided.'
  },
  timestamp: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.prediction-display-container {
  text-align: left;
}

.prediction-display-container h2 {
  text-align: center;
  margin-bottom: 25px;
}

.result-section, .explanation-section {
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid var(--border-color, #add8e6);
  border-radius: 8px;
  background-color: var(--background-color, #f0f8ff);
}

.result-section:last-child, .explanation-section:last-child {
  margin-bottom: 0; /* If no timestamp, then the last section has no margin */
}
/* If timestamp is present, the sections might still need margin-bottom if timestamp is outside them */
.result-section { margin-bottom: 20px; }
.explanation-section { margin-bottom: 20px; }


.result-section h3, .explanation-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.25em;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  padding-bottom: 8px;
}

.conclusion-text, .explanation-text {
  font-size: 1em;
  line-height: 1.7;
  color: var(--text-color, #333);
  white-space: pre-line; /* Ensures newlines from the prop are rendered */
  text-align: justify;
}

.timestamp {
  font-size: 0.85em; /* Slightly larger for readability */
  color: var(--text-light-color, #777);
  margin-top: 20px; /* Space above the timestamp */
  padding-top: 10px; /* Padding for separation if sections don't have enough margin */
  border-top: 1px solid var(--border-color, #eee); /* Subtle separator line */
  text-align: right;
}
</style>
