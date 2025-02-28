<template>
  <div class="flex flex-col justify-center items-center ">

    <div class="w-[300px] bg-gray-900 border-2 border-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)] rounded-lg transition-all duration-700 opacity-100 scale-100"
     >

      <div class="p-6 flex flex-col items-center">
        <div class="relative mb-8 mt-4">
          <h1 class="text-6xl font-bold text-center text-red-500 animate-pulse tracking-wider">
            GAME OVER
          </h1>
          <Sparkles class="absolute -top-4 -right-4 text-yellow-400 animate-spin" :size="28" />
          <Sparkles class="absolute -bottom-4 -left-4 text-yellow-400 animate-spin" :size="28" />

        </div>

        <div class="space-y-4 w-full mb-8">
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p class="text-gray-400 text-sm mb-1">TU SCORE</p>
            <p class="text-4xl font-mono text-white">{{ score }}</p>
          </div>

          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p class="text-gray-400 text-sm mb-1">HIGH SCORE</p>
            <p class="text-4xl font-mono" :class="score > highScore ? 'text-yellow-400' : 'text-white'">
              {{ highScore }}
            </p>
            <p v-if="score > highScore" class="text-yellow-400 text-sm mt-1 animate-bounce">Nuevo Record!</p>
          </div>
        </div>

        <div class="w-full">
          <button
            class="flex items-center justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-md transition-colors"
            @click="$emit('tryAgain')"
          >
            <RotateCcw class="mr-2 h-4 w-4" />
            Intentar nuevamente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { Sparkles, RotateCcw, Home } from 'lucide-vue-next';
interface Props{
  score:number;
  highScore:number;
}

defineProps<Props>();

const emit = defineEmits(['tryAgain']);
</script>

<style scoped>

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
  animation: spin 3s linear infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

</style>
