<template>
    <div class="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
      <p class="text-lg font-medium text-gray-700">
        Bot {{ botIndex + 1 }}: 
        <span v-if="handCount !== null && handCount !== undefined">{{ handCount }}</span> 
        <span v-else>Loading...</span> cards
      </p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      botIndex: {
        type: Number,
        required: true, // Ensure botIndex is provided
      },
      handCount: {
        type: Number,
        default: 0, // Default to 0 cards if not provided
      },
    },
  };
  </script>
  