<template>
  <section
    v-if="isLoading || randomPokemon.id === null"
    class="flex flex-col justify-center items-center w-screen h-screen"
  >
    <!-- <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pókemons</h3> -->

    <h2 v-if="score > 70" class="text-green-600 dark:text-green-400 text-4xl">
      Felicidades eres un Ganador
    </h2>
    <h2 v-else class="text-red-600 dark:text-red-400 text-4xl">
      Pff... Esta vez no se logro aprende más de Pokémon
    </h2>

    <button
      v-if="lengthPokemons / 4 === 0"
      class="mb-5 capitalize bg-blue-500 shadow-md rounded-md p-2 m-2 text-center text-white font-medium hover:bg-blue-700 transition-all mt-4"
      @click="resetGame()"
    >
      ¿Deseas reiniciar el juego?
    </button>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="m-5">¿Quién es este Pokémon?</h1>
    <h2 class="text-black-600 dark:text-sky-400">
      Juegos Faltantes: <span class="text-blue-500 font-bold">{{ lengthPokemons / 4 }} </span>
    </h2>
    <div class="columns-3" v-if="lengthPokemons / 4 > 0">
      <h2 class="text-black-600 dark:text-sky-400">
        Correctos: <span class="text-green-500 font-bold">{{ correctAttempts }} </span>
      </h2>
      <h2 class="text-black-600 dark:text-sky-400">
        Inorrectos: <span class="text-red-500 font-bold">{{ incorrectAttempts }} </span>
      </h2>
      <h2 class="text-black-600 dark:text-sky-400 text-lg">
        Score: <span class="text-blue-500 font-bold">{{ score }} % </span>
      </h2>
    </div>

    <div class="h-20">
      <button
        v-if="gameStatus !== GameStatus.Playing && lengthPokemons / 4 > 0"
        class="mb-5 capitalize bg-blue-500 shadow-md rounded-md p-2 m-2 text-center text-white font-medium hover:bg-blue-700 transition-all"
        @click="getNextRound()"
      >
        ¿Jugar de nuevo?
      </button>
    </div>
    <!-- Pokémon Picture -->
    <div
      class="bg-[url(../assets/images/whothats.png)] bg-contain bg-no-repeat h-[220px] w-[330px] rounded-xl"
    >
      <PokemonPicture
        :pokemon-id="randomPokemon.id"
        :show-pokemon="gameStatus !== GameStatus.Playing"
      ></PokemonPicture>
    </div>

    <!-- Pokemon Options -->

    <PokemonOptions
      :options="options"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon.id"
      @selected-option="checkAnswer"
    ></PokemonOptions>
  </section>
</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  randomPokemon,
  isLoading,
  gameStatus,
  lengthPokemons,
  pokemonOptions: options,
  correctAttempts,
  incorrectAttempts,
  score,
  checkAnswer,
  getNextRound,
  resetGame,
} = usePokemonGame();
</script>
