<template>
  <div id="app-container">
    <header>
      <h1>Taoist Divination Online</h1>
    </header>
    <main>
      <UserInfoForm @submit-user-data="handleDivinationRequest" />
      <PredictionDisplay
        :conclusion="divinationResult.conclusion"
        :explanation="divinationResult.explanation"
        :timestamp="divinationResult.timestamp"
      />
    </main>
    <footer>
      <p>&copy; {{ new Date().getFullYear() }} Taoist Divination Services. For entertainment purposes only.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserInfoForm from './components/UserInfoForm.vue';
import PredictionDisplay from './components/PredictionDisplay.vue';

const divinationResult = ref({
  conclusion: 'Please submit your information using the form above to receive your divination.',
  explanation: 'The principles of Taoist divination will be explained alongside your result.',
  timestamp: ''
});

// const isProcessingDivination = ref(false); // Could be used for a global spinner

const handleDivinationRequest = (userData) => {
  // isProcessingDivination.value = true;
  console.log('Received user data in App.vue:', userData);

  return new Promise(resolve => {
    setTimeout(() => {
      let mockConclusion = `Greetings, ${userData.name || 'Seeker'}. `;
      const explanations = [
        "This reading draws upon the ancient wisdom of the I Ching, interpreting the hexagrams formed by the interplay of cosmic energies related to your query. The focus is on the ever-changing flow of Qi and its manifestations in your current situation.",
        "Based on the foundational principles of Wu Xing (The Five Elements: Wood, Fire, Earth, Metal, Water), this divination analyzes the balance and interaction of these elemental forces in relation to your personal data and specific question. Harmony and flow are key.",
        "The insight for this divination comes from observing celestial patterns (Tian Wen) and their traditional Taoist interpretations. Planetary alignments and their symbolic meanings are considered to shed light on your life's path and query.",
        "This divination method considers your BaZi (Four Pillars of Destiny) chart, derived from your unique birth details (time, day, month, year). This helps to understand the elemental forces shaping your experiences and potential outcomes related to your query.",
        "Drawing from the esoteric texts of the Taoist Canon, this reading looks at the subtle energetic signatures around your query, considering both temporal and spiritual influences to offer guidance."
      ];
      let mockExplanationText = `For your query about "${userData.predictionContent || 'the unknown'}":\n\n${explanations[Math.floor(Math.random() * explanations.length)]}\n\n`;

      if (userData.age && userData.age < 18) {
        mockConclusion += "The path of youth is like a sprouting seed, full of potential and tender growth. Nurture your dreams with care, for the Azure Dragon watches over beginnings.";
        mockExplanationText += "This phase aligns with the budding energies of the Wood element, emphasizing growth, flexibility, and learning. Celestial influences suggest a time for exploration and absorbing new knowledge rather than making unshakeable, long-term decisions.";
      } else if (userData.age && userData.age >= 18 && userData.age < 30) {
        mockConclusion += "The energies around you are vibrant, like the Vermilion Bird taking flight, pointing towards new beginnings and forging your own path. Embrace change with courage and decisive action.";
        mockExplanationText += "This reading considers the element of Fire, often associated with passion, action, expansion, and visibility in Taoist cosmology. Your current life phase is ripe for dynamic growth, creative expression, and asserting your individuality.";
      } else if (userData.age && userData.age >= 30 && userData.age < 50) {
        mockConclusion += "The path reveals a phase of consolidation and fruition, like the Yellow Dragon guarding the central plains. Your experiences are your strength, and stability is a virtue to cultivate.";
        mockExplanationText += "This reading aligns with the element of Earth, signifying stability, nurturing, grounding, and the harvest of efforts. Decisions now should focus on long-term foundations, community, and building upon what you've learned.";
      } else if (userData.age && userData.age >= 50) {
        mockConclusion += "A time of reflection and sharing wisdom is upon you, like the White Tiger of autumn, embodying discernment. The Metal element suggests clarity, refinement, and the appreciation of enduring values.";
        mockExplanationText += "This phase is often associated with the Metal element, representing maturity, discernment, harvest, and the distillation of life's lessons. Your insights can guide others, and inner peace through order and principle is a primary pursuit.";
      } else {
        mockConclusion += "The mists of fate are particularly thick. Ensure all your details are provided for a clearer insight into the flowing Tao.";
        mockExplanationText += "A complete reading requires sufficient information to align with the Taoist elemental charts and temporal calculations. Each piece of information helps to map the cosmic energies relevant to your being.";
      }

      if (userData.photo && userData.photo.name) {
         mockConclusion += `\n\nThe image you provided, '${userData.photo.name}', while not a traditional component, symbolizes your focused intent (Yi) in this seeking, adding a personal resonance.`;
         mockExplanationText += `\n\nIn Taoist thought, focused intention (Yi) is a powerful force that can guide Qi (vital energy). Your act of providing a personal symbol like a photo can be seen as an enhancement to this focus, directing the spiritual energies of the divination.`;
      }

      divinationResult.value = {
        conclusion: mockConclusion,
        explanation: mockExplanationText,
        timestamp: new Date().toLocaleString()
      };
      // isProcessingDivination.value = false;
      resolve(); // Resolve the promise after timeout and processing
    }, 1500); // 1.5 second delay
  });
};
</script>

<style>
/* App.vue specific styles - not scoped to allow some global overrides if necessary, but mainly for app layout */
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure footer is at bottom if content is short */
  align-items: center;
  padding: 20px; /* Padding for the overall app container from viewport edges */
  max-width: 1200px; /* Max width for the app content */
  margin: 0 auto; /* Center the app container itself */
}

header {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--primary-color, #4a90e2); /* Use CSS var with fallback */
}

header h1 {
  /* font-family is already set globally in main.css for h1 */
  font-size: 2.8em; /* Slightly larger */
  color: var(--primary-color, #333); /* Use CSS var */
  margin: 0;
  font-weight: bold;
}

main {
  width: 100%;
  max-width: 800px; /* Max width for the main content (form + results area) */
  display: flex;
  flex-direction: column;
  gap: 35px; /* Increased space between UserInfoForm and PredictionDisplay */
  flex-grow: 1; /* Allows main to take up available space, pushing footer down */
}

footer {
  width: 100%;
  text-align: center;
  margin-top: 40px; /* Space above the footer */
  padding: 20px 0;
  border-top: 1px solid var(--border-color, #ddd);
  font-size: 0.9em;
  color: var(--text-light-color, #555);
}
</style>
