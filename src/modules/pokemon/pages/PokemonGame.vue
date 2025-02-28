<template>

  <LoadingComponent :is-loading="isLoading"></LoadingComponent>

  <section v-if="!isLoading && lengthPokemons >=4" class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="mt-8 mb-2 font-bold leading-none  text-red-900 md:text-2xl lg:text-3xl ">¿Quién es este Pokémon?</h1>

    <div v-if="opportunities > 0" class="flex flex-col justify-center items-center w-screen h-screen">
      <div class="columns-2">
        <h2 class="text-orange-800 font-bold mb-3">
          Intentos Restantes: <span class="text-red-800 font-bold text-xl" >{{ opportunities }} </span>
        </h2>
        <h2 class="text-blue-800 font-bold mb-3">
          Score: <span class="text-green-900 font-bold text-xl" >{{ gameScore }} </span>
        </h2>
      </div>

      <div
        class="bg-[url(../assets/images/whothats.png)] bg-contain bg-no-repeat h-[220px] w-[330px] rounded-xl"
      >
        <PokemonPicture
          :pokemon-id="winnerPokemon.id"
          :show-pokemon="gameStatus !== GameStatus.Playing"
        ></PokemonPicture>
      </div>

      <PokemonOptions
        :options="options"
        :block-selection="gameStatus !== GameStatus.Playing"
        :correct-answer="winnerPokemon.id"
        @selected-option="checkAnswer"
      ></PokemonOptions>

    </div>

    <div v-else>
     <GameOver :score="gameScore" :high-score="highScore" @tryAgain="resetGame"></GameOver>
    </div>

  </section>

</template>

<script setup lang="ts">
import LoadingComponent from '../components/LoadingComponent.vue';
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import GameOver from '../components/GameOver.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  winnerPokemon,
  isLoading,
  gameStatus,
  lengthPokemons,
  pokemonOptions: options,
  gameScore,
  opportunities,
  highScore,
  checkAnswer,
  resetGame,
} = usePokemonGame();
</script>
