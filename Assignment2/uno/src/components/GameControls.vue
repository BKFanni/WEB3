<template>
  <div class="controls">
    <button @click="$emit('drawCard')" class="btn">Draw Card</button>
    <button @click="$emit('callUno')" class="btn">Call Uno</button>
  </div>
</template>

<style scoped>
.btn {
  margin: 5px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
