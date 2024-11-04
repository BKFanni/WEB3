<!-- App.vue -->
<template>
  <div id="app">
    <HandPlay /> <!-- Import and use your game component -->
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import HandPlay from './components/HandPlay.vue';

export default {
  components: { HandPlay },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch('initializeGame'); // Initialize game state when app loads
    });

    return {};
  },
};
</script>