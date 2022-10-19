<template>
<div class="s-wrapper" @mouseup="painting = false">
  <div class="s-canvas" @mousedown="painting = true" @mousemove="paint" ref="canvas">
    <div v-for="(rowData, idx) in levelData" :key="idx" class="s-row">
      <div v-for="(cellData, colIdx) in rowData" :key="colIdx" class="s-cell" :class="{'-visible': cellData}">
      
      </div>
    </div>
  </div>
  <div class="s-menu">

  </div>
</div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  const painting = ref(false)
  const levelData = ref<boolean[][]>([])
  const canvasMargin = 20
  const paint = (e: MouseEvent) => {
    if(painting.value) {
      const column = Math.floor((e.clientX - canvasMargin) / 10)
      const row = Math.floor((e.clientY - canvasMargin) / 10)
      while(levelData.value.length <= row) {
        levelData.value[levelData.value.length] = []
      }
      while(levelData.value[row].length <= column) {
        levelData.value[row][levelData.value[row].length] = false
      }
      levelData.value[row][column] = true
    }
  }
</script>

<style scoped>
  .s-wrapper {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px;
    height: 100%;
  }
  .s-canvas {
    background: #222222;
    flex: 1;
    box-shadow: 0px 9px 55px -3px rgba(0,0,0,0.9);
    border-radius: 6px;
  }
  .s-menu {
    width: 200px;
    background: #151515;
    box-shadow: 0px 9px 35px -3px rgba(0,0,0,0.7);
    border-radius: 6px;
  }
  .s-row {
    display: flex;
    flex-direction: row;
    height: 10px;
  }
  .s-cell {
    width: 10px;
    height: 10px;
  }
  .s-cell.-visible {
    outline: 1px solid blue;
  }
</style>
