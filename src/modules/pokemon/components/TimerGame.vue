<template>
  <div class="flex flex-col justify-center items-center w-screen">
      <h1 class="text-4xl font-bold mb-6 text-gray-800">Timer</h1>
      <div class="text-3xl font-mono mb-2 bg-white py-3 px-6 rounded-xl shadow-inner w-[120px] text-center">
      {{ formatTime() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
const seconds = ref<number>(10);
const isRunning = ref<boolean>(false);
const nextOption = ref<boolean>(false);
let timerInterval:any;

const formatTime = () => {
  const secondsAvailable = String(seconds.value).padStart(2, '0')
  return secondsAvailable
}
const startTimer = () => {
  if (isRunning.value) return
  isRunning.value = true
  timerInterval = setInterval(() => {
    seconds.value--;
    if(seconds.value == 0){
      clearInterval(timerInterval);
      nextOption.value = true;
    }
  }, 1000)
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

onMounted(()=>{
  startTimer();
})

</script>

<style scoped>

</style>
