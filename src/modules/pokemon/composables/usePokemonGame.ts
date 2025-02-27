import { computed, onMounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import { pokemonApi } from '../api/pokemonApi';

import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);

  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);

  const randomPokemon = computed(
    () => pokemonOptions.value[Math.floor(Math.random() * pokemonOptions.value.length)],
  );
  const isLoading = computed(() => pokemons.value.length === 0);

  const lengthPokemons = computed(() => pokemons.value.length);

  const correctAttempts = ref<number>(0);
  const incorrectAttempts = ref<number>(0);

  const score = ref<number>(100);

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=40');
    const pokemonsArray = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/');
      const id = urlParts.at(-2) ?? 0;
      return {
        name: pokemon.name,
        id: +id,
      };
    });

    return pokemonsArray.sort(() => Math.random() - 0.5);
  };

  const checkAnswer = (id: number) => {
    const hasWon = randomPokemon.value.id === id;
    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      correctAttempts.value++;
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      });
      return;
    }

    incorrectAttempts.value++;

    score.value = 100 - incorrectAttempts.value * 10;

    gameStatus.value = GameStatus.Lost;
  };

  const getNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany);
    //console.log(pokemons.value.length);
  };

  const resetGame = async () => {
    gameStatus.value = GameStatus.Playing;
    incorrectAttempts.value = 0;
    correctAttempts.value = 0;
    score.value = 100;
    pokemons.value = await getPokemons();
  };

  onMounted(async () => {
    pokemons.value = await getPokemons();
    getNextRound();
  });

  return {
    gameStatus,
    isLoading,
    pokemonOptions,
    randomPokemon,
    lengthPokemons,
    correctAttempts,
    incorrectAttempts,
    score,
    //Methods
    getNextRound,
    checkAnswer,
    resetGame,
  };
};
